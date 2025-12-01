import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import Anthropic from 'anthropic';
import { SeoService } from '../seo/seo.service';
import { KeywordsService } from '../keywords/keywords.service';
import { BrandVoiceService } from '../brand-voice/brand-voice.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateProductDto } from './dto/generate-product.dto';
import { Language } from '@prisma/client';

export interface GenerationResult {
  description: string;
  shortDescription: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
  };
  altTexts: string[];
  attributes: {
    color?: string;
    material?: string;
    category?: string;
    tags: string[];
  };
  confidenceScore: number;
  seoScore: number;
  readabilityGrade: string;
}

export interface OcrResult {
  text: string;
  labels: string[];
  confidence: number;
}

export interface VisionAnalysis {
  colors: string[];
  materials: string[];
  category: string;
  style: string;
  scene: string;
  objects: string[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private seoService: SeoService,
    private keywordsService: KeywordsService,
    private brandVoiceService: BrandVoiceService,
  ) {
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    const anthropicKey = this.configService.get<string>('ANTHROPIC_API_KEY');

    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }

    if (anthropicKey) {
      this.anthropic = new Anthropic({ apiKey: anthropicKey });
    }
  }

  /**
   * Huvudfunktion för att generera produktbeskrivning
   * Kombinerar OCR, Vision-analys, Brand Voice och SEO-optimering
   */
  async generateProductDescription(
    dto: GenerateProductDto,
    userId: string,
    organizationId: string,
  ): Promise<GenerationResult> {
    const startTime = Date.now();

    this.logger.log(`Startar generering för: ${dto.title || 'Produktbild'}`);

    // 1. Kör OCR på bilder (Google Vision)
    const ocrResults = await this.runOcr(dto.imageUrls);

    // 2. Kör GPT-4o Vision för bildanalys
    const visionAnalysis = await this.analyzeImagesWithVision(dto.imageUrls);

    // 3. Hämta Brand Voice om definierad
    let brandVoiceProfile = null;
    if (dto.brandVoiceId) {
      brandVoiceProfile = await this.brandVoiceService.getBrandVoice(dto.brandVoiceId);
    }

    // 4. Hämta relevanta keywords
    const suggestedKeywords = await this.keywordsService.getSuggestedKeywords(
      dto.keywords || [],
      dto.language,
    );

    // 5. Kombinera all information och generera text
    const generatedContent = await this.generateWithAi({
      title: dto.title,
      ocrText: ocrResults.text,
      ocrLabels: ocrResults.labels,
      visionAnalysis,
      keywords: [...(dto.keywords || []), ...suggestedKeywords],
      language: dto.language,
      brandVoiceProfile,
    });

    // 6. Beräkna SEO-poäng
    const seoScore = this.seoService.calculateSeoScore({
      title: generatedContent.seo.metaTitle,
      description: generatedContent.description,
      metaDescription: generatedContent.seo.metaDescription,
      keywords: dto.keywords || [],
    });

    // 7. Beräkna läsbarhet
    const readabilityGrade = this.seoService.calculateReadability(generatedContent.description);

    // 8. Spara generering i databasen
    const generation = await this.prisma.generation.create({
      data: {
        userId,
        organizationId,
        title: dto.title,
        keywords: dto.keywords || [],
        imageUrls: dto.imageUrls,
        language: dto.language,
        brandVoiceId: dto.brandVoiceId,
        description: generatedContent.description,
        shortDescription: generatedContent.shortDescription,
        metaTitle: generatedContent.seo.metaTitle,
        metaDescription: generatedContent.seo.metaDescription,
        slug: generatedContent.seo.slug,
        altTexts: generatedContent.altTexts,
        attributes: generatedContent.attributes,
        confidenceScore: generatedContent.confidenceScore,
        seoScore,
        readabilityGrade,
        status: 'COMPLETED',
        processingTimeMs: Date.now() - startTime,
        aiModel: 'gpt-4o',
      },
    });

    this.logger.log(`Generering klar på ${Date.now() - startTime}ms`);

    return {
      ...generatedContent,
      seoScore,
      readabilityGrade,
    };
  }

  /**
   * Kör OCR på bilder med Google Cloud Vision
   */
  private async runOcr(imageUrls: string[]): Promise<OcrResult> {
    // Simulerad OCR - i produktion använd Google Cloud Vision
    this.logger.log(`Kör OCR på ${imageUrls.length} bilder`);

    // Google Vision API integration skulle se ut så här:
    // const vision = require('@google-cloud/vision');
    // const client = new vision.ImageAnnotatorClient();
    // const [result] = await client.textDetection(imageUrl);

    return {
      text: '',
      labels: [],
      confidence: 0.9,
    };
  }

  /**
   * Analysera bilder med GPT-4o Vision
   */
  private async analyzeImagesWithVision(imageUrls: string[]): Promise<VisionAnalysis> {
    if (!this.openai || imageUrls.length === 0) {
      return {
        colors: [],
        materials: [],
        category: 'uncategorized',
        style: 'modern',
        scene: 'product shot',
        objects: [],
      };
    }

    try {
      const imageContent = imageUrls.map((url) => ({
        type: 'image_url' as const,
        image_url: { url },
      }));

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Du är en expertbildanalytiker för e-handel. Analysera produktbilder och returnera JSON med:
- colors: array av färger (på svenska)
- materials: array av material (på svenska)
- category: produktkategori
- style: designstil
- scene: bildscen/bakgrund
- objects: synliga objekt`,
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analysera dessa produktbilder:' },
              ...imageContent,
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } catch (error) {
      this.logger.error('Vision-analys misslyckades:', error);
    }

    return {
      colors: [],
      materials: [],
      category: 'uncategorized',
      style: 'modern',
      scene: 'product shot',
      objects: [],
    };
  }

  /**
   * Generera produkttext med AI
   */
  private async generateWithAi(params: {
    title?: string;
    ocrText: string;
    ocrLabels: string[];
    visionAnalysis: VisionAnalysis;
    keywords: string[];
    language: Language;
    brandVoiceProfile: Record<string, unknown> | null;
  }): Promise<Omit<GenerationResult, 'seoScore' | 'readabilityGrade'>> {
    const languageMap: Record<Language, string> = {
      SV: 'svenska',
      EN: 'engelska',
      NO: 'norska',
      DA: 'danska',
      FI: 'finska',
      DE: 'tyska',
    };

    const targetLanguage = languageMap[params.language] || 'svenska';

    const brandVoiceInstructions = params.brandVoiceProfile
      ? `
Använd följande varumärkesröst:
- Tonalitet: ${JSON.stringify(params.brandVoiceProfile)}
`
      : '';

    const systemPrompt = `Du är en expertskribent för e-handel specialiserad på SEO-optimerade produkttexter.
Skriv på ${targetLanguage}.
${brandVoiceInstructions}

Returnera alltid JSON med exakt denna struktur:
{
  "description": "Fullständig produktbeskrivning (150-300 ord)",
  "shortDescription": "Kort sammanfattning (30-50 ord)",
  "seo": {
    "metaTitle": "SEO-titel (max 60 tecken)",
    "metaDescription": "Meta-beskrivning (max 160 tecken)",
    "slug": "seo-vanlig-url-slug"
  },
  "altTexts": ["Alt-text 1", "Alt-text 2"],
  "attributes": {
    "color": "färg",
    "material": "material",
    "category": "kategori",
    "tags": ["tagg1", "tagg2"]
  },
  "confidenceScore": 0.95
}`;

    const userPrompt = `Generera produkttext för:
Titel: ${params.title || 'Produkt'}
OCR-text från bild: ${params.ocrText || 'Ingen text'}
Bildanalys: ${JSON.stringify(params.visionAnalysis)}
Nyckelord att inkludera: ${params.keywords.join(', ') || 'Inga specificerade'}

Skapa engagerande, SEO-optimerad text som inkluderar nyckelorden naturligt.`;

    // Försök med GPT-4o först
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 2000,
          temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          return JSON.parse(content);
        }
      } catch (error) {
        this.logger.error('GPT-4o misslyckades, försöker med Claude:', error);
      }
    }

    // Fallback till Claude
    if (this.anthropic) {
      try {
        const response = await this.anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        });

        const textContent = response.content.find((c) => c.type === 'text');
        if (textContent && textContent.type === 'text') {
          return JSON.parse(textContent.text);
        }
      } catch (error) {
        this.logger.error('Claude misslyckades:', error);
      }
    }

    // Returnera standardsvar om båda misslyckas
    return this.getDefaultResponse(params.title || 'Produkt', params.language);
  }

  /**
   * Standardsvar om AI misslyckas
   */
  private getDefaultResponse(
    title: string,
    language: Language,
  ): Omit<GenerationResult, 'seoScore' | 'readabilityGrade'> {
    const slug = title
      .toLowerCase()
      .replace(/[åä]/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      description: `Upptäck ${title} - en kvalitetsprodukt för moderna behov.`,
      shortDescription: `${title} - kvalitet och design.`,
      seo: {
        metaTitle: `${title} | Köp online`,
        metaDescription: `Handla ${title} till bästa pris. Snabb leverans och trygg betalning.`,
        slug,
      },
      altTexts: [`${title} produktbild`],
      attributes: {
        category: 'uncategorized',
        tags: [],
      },
      confidenceScore: 0.5,
    };
  }

  /**
   * Förbättra befintlig text (Rewrite Mode)
   */
  async rewriteText(
    existingText: string,
    improvements: string[],
    language: Language,
  ): Promise<string> {
    if (!this.openai) {
      return existingText;
    }

    const languageMap: Record<Language, string> = {
      SV: 'svenska',
      EN: 'engelska',
      NO: 'norska',
      DA: 'danska',
      FI: 'finska',
      DE: 'tyska',
    };

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Du är en expertskribent. Förbättra texten på ${languageMap[language]} baserat på feedback.`,
        },
        {
          role: 'user',
          content: `Originaltext:\n${existingText}\n\nFörbättringar att göra:\n${improvements.join('\n')}`,
        },
      ],
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || existingText;
  }

  /**
   * Översätt genererad text till annat språk
   */
  async translateGeneration(
    generationId: string,
    targetLanguage: Language,
  ): Promise<GenerationResult> {
    const original = await this.prisma.generation.findUnique({
      where: { id: generationId },
    });

    if (!original) {
      throw new Error('Generering hittades inte');
    }

    if (!this.openai) {
      throw new Error('OpenAI ej konfigurerad');
    }

    const languageMap: Record<Language, string> = {
      SV: 'svenska',
      EN: 'engelska',
      NO: 'norska',
      DA: 'danska',
      FI: 'finska',
      DE: 'tyska',
    };

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Du är en expertöversättare. Översätt produkttext till ${languageMap[targetLanguage]}.
Behåll SEO-optimering och ton. Returnera JSON med samma struktur som input.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            description: original.description,
            shortDescription: original.shortDescription,
            seo: {
              metaTitle: original.metaTitle,
              metaDescription: original.metaDescription,
              slug: original.slug,
            },
            altTexts: original.altTexts,
          }),
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    const translated = JSON.parse(response.choices[0]?.message?.content || '{}');

    return {
      ...translated,
      attributes: original.attributes,
      confidenceScore: original.confidenceScore || 0.9,
      seoScore: original.seoScore || 80,
      readabilityGrade: original.readabilityGrade || 'B',
    };
  }
}
