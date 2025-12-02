import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';

export interface GenerateImageDto {
  prompt: string;
  style?: 'product' | 'lifestyle' | 'minimalist' | 'luxury' | 'natural';
  aspectRatio?: '1:1' | '16:9' | '4:3' | '9:16';
  model?: 'dall-e-3' | 'dall-e-2';
}

export interface GeneratedImageResult {
  id: string;
  imageUrl: string;
  revisedPrompt?: string;
}

@Injectable()
export class ImageGenerationService {
  private readonly logger = new Logger(ImageGenerationService.name);
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  /**
   * Generera produktbild med AI
   */
  async generateImage(
    dto: GenerateImageDto,
    userId: string,
    organizationId: string,
  ): Promise<GeneratedImageResult> {
    this.logger.log(`Genererar bild: ${dto.prompt.substring(0, 50)}...`);

    // Skapa databaspositionen först
    const generatedImage = await this.prisma.generatedImage.create({
      data: {
        organizationId,
        userId,
        prompt: dto.prompt,
        style: dto.style || 'product',
        aspectRatio: dto.aspectRatio || '1:1',
        model: dto.model || 'dall-e-3',
        status: 'PROCESSING',
      },
    });

    try {
      // Förbättra prompten för produktbilder
      const enhancedPrompt = this.enhancePrompt(dto.prompt, dto.style || 'product');

      // Mappa aspect ratio till DALL-E format
      const size = this.mapAspectRatioToSize(dto.aspectRatio || '1:1');

      // Generera med DALL-E
      const response = await this.openai.images.generate({
        model: dto.model || 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size,
        quality: 'hd',
        style: dto.style === 'natural' ? 'natural' : 'vivid',
      });

      const imageUrl = response.data[0]?.url;
      const revisedPrompt = response.data[0]?.revised_prompt;

      if (!imageUrl) {
        throw new Error('Ingen bild genererades');
      }

      // Uppdatera med resultat
      await this.prisma.generatedImage.update({
        where: { id: generatedImage.id },
        data: {
          imageUrl,
          status: 'COMPLETED',
        },
      });

      // Dra krediter
      await this.prisma.organization.update({
        where: { id: organizationId },
        data: {
          creditsBalance: { decrement: 2 },
        },
      });

      this.logger.log(`Bild genererad: ${generatedImage.id}`);

      return {
        id: generatedImage.id,
        imageUrl,
        revisedPrompt,
      };
    } catch (error) {
      // Markera som misslyckad
      await this.prisma.generatedImage.update({
        where: { id: generatedImage.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Okänt fel',
        },
      });

      this.logger.error('Bildgenerering misslyckades:', error);
      throw error;
    }
  }

  /**
   * Generera produktbild baserat på beskrivning
   */
  async generateFromDescription(
    productDescription: string,
    userId: string,
    organizationId: string,
    style?: string,
  ): Promise<GeneratedImageResult> {
    // Extrahera nyckelord från beskrivningen
    const prompt = await this.createPromptFromDescription(productDescription);

    return this.generateImage(
      {
        prompt,
        style: (style as GenerateImageDto['style']) || 'product',
      },
      userId,
      organizationId,
    );
  }

  /**
   * Hämta genererade bilder för organisation
   */
  async getGeneratedImages(organizationId: string, limit = 20) {
    return this.prisma.generatedImage.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Förbättra prompt för bättre produktbilder
   */
  private enhancePrompt(basePrompt: string, style: string): string {
    const styleEnhancements: Record<string, string> = {
      product: 'professional product photography, white background, studio lighting, high resolution, commercial quality, centered composition',
      lifestyle: 'lifestyle product photography, natural setting, warm lighting, aspirational, in-context use',
      minimalist: 'minimalist product shot, clean design, negative space, Scandinavian aesthetic, simple composition',
      luxury: 'luxury product photography, elegant lighting, premium feel, high-end commercial quality, sophisticated',
      natural: 'natural product photography, organic setting, soft lighting, authentic feel',
    };

    const enhancement = styleEnhancements[style] || styleEnhancements.product;
    return `${basePrompt}. Style: ${enhancement}`;
  }

  /**
   * Mappa aspect ratio till DALL-E storlekar
   */
  private mapAspectRatioToSize(aspectRatio: string): '1024x1024' | '1792x1024' | '1024x1792' {
    const sizeMap: Record<string, '1024x1024' | '1792x1024' | '1024x1792'> = {
      '1:1': '1024x1024',
      '16:9': '1792x1024',
      '4:3': '1792x1024',
      '9:16': '1024x1792',
    };
    return sizeMap[aspectRatio] || '1024x1024';
  }

  /**
   * Skapa bildprompt från produktbeskrivning
   */
  private async createPromptFromDescription(description: string): Promise<string> {
    if (!this.openai) {
      // Fallback: extrahera nyckelord manuellt
      return `Product: ${description.substring(0, 200)}`;
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Du är expert på att skapa bildpromptar för produktbilder.
          Extrahera de viktigaste visuella elementen från produktbeskrivningen
          och skapa en kort, beskrivande prompt på engelska.
          Max 100 ord. Fokusera på: färg, material, form, storlek, användning.`,
        },
        {
          role: 'user',
          content: `Produktbeskrivning: ${description}`,
        },
      ],
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content || `Product: ${description.substring(0, 100)}`;
  }

  /**
   * Generera varianter av en bild
   */
  async generateVariants(
    imageId: string,
    count: number,
    userId: string,
    organizationId: string,
  ): Promise<GeneratedImageResult[]> {
    const original = await this.prisma.generatedImage.findUnique({
      where: { id: imageId },
    });

    if (!original) {
      throw new Error('Originalbild hittades inte');
    }

    const variants: GeneratedImageResult[] = [];
    const styles: GenerateImageDto['style'][] = ['product', 'lifestyle', 'minimalist', 'luxury'];

    for (let i = 0; i < Math.min(count, 4); i++) {
      const variant = await this.generateImage(
        {
          prompt: original.prompt,
          style: styles[i % styles.length],
          aspectRatio: original.aspectRatio as GenerateImageDto['aspectRatio'],
        },
        userId,
        organizationId,
      );
      variants.push(variant);
    }

    return variants;
  }
}
