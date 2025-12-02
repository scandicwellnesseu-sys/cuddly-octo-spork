import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service';

export interface ToneProfile {
  formal: number;
  friendly: number;
  technical: number;
  playful: number;
  professional: number;
}

export interface VocabularyStyle {
  preferredWords: string[];
  avoidWords: string[];
  industryTerms: string[];
}

export interface SentenceStructure {
  avgLength: number;
  complexity: 'simple' | 'medium' | 'complex';
  usesBulletPoints: boolean;
  usesQuestions: boolean;
}

export interface BrandVoiceProfile {
  id: string;
  name: string;
  toneProfile: ToneProfile;
  vocabularyStyle: VocabularyStyle;
  sentenceStructure: SentenceStructure;
}

@Injectable()
export class BrandVoiceService {
  private readonly logger = new Logger(BrandVoiceService.name);
  private openai: OpenAI | null = null;

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
   * Hämta Brand Voice profil
   */
  async getBrandVoice(id: string): Promise<Record<string, unknown> | null> {
    const brandVoice = await this.prisma.brandVoice.findUnique({
      where: { id },
    });

    if (!brandVoice) {
      return null;
    }

    return {
      id: brandVoice.id,
      name: brandVoice.name,
      toneProfile: brandVoice.toneProfile,
      vocabularyStyle: brandVoice.vocabularyStyle,
      sentenceStructure: brandVoice.sentenceStructure,
    };
  }

  /**
   * Analysera exempeltexter och skapa Brand Voice profil
   */
  async analyzeTexts(
    userId: string,
    organizationId: string,
    name: string,
    exampleTexts: string[],
    description?: string,
  ): Promise<BrandVoiceProfile> {
    this.logger.log(`Analyserar ${exampleTexts.length} texter för Brand Voice: ${name}`);

    let toneProfile: ToneProfile = {
      formal: 0.5,
      friendly: 0.5,
      technical: 0.3,
      playful: 0.3,
      professional: 0.7,
    };

    let vocabularyStyle: VocabularyStyle = {
      preferredWords: [],
      avoidWords: [],
      industryTerms: [],
    };

    let sentenceStructure: SentenceStructure = {
      avgLength: 15,
      complexity: 'medium',
      usesBulletPoints: false,
      usesQuestions: false,
    };

    // Analysera med AI om tillgänglig
    if (this.openai && exampleTexts.length > 0) {
      try {
        const analysis = await this.analyzeWithAi(exampleTexts);
        toneProfile = analysis.toneProfile;
        vocabularyStyle = analysis.vocabularyStyle;
        sentenceStructure = analysis.sentenceStructure;
      } catch (error) {
        this.logger.error('AI-analys misslyckades, använder manuell analys:', error);
        const manualAnalysis = this.manualAnalyze(exampleTexts);
        sentenceStructure = manualAnalysis.sentenceStructure;
        vocabularyStyle.preferredWords = manualAnalysis.commonWords;
      }
    } else {
      // Manuell analys om AI ej tillgänglig
      const manualAnalysis = this.manualAnalyze(exampleTexts);
      sentenceStructure = manualAnalysis.sentenceStructure;
      vocabularyStyle.preferredWords = manualAnalysis.commonWords;
    }

    // Spara i databasen
    const brandVoice = await this.prisma.brandVoice.create({
      data: {
        userId,
        organizationId,
        name,
        description,
        exampleTexts,
        toneProfile,
        vocabularyStyle,
        sentenceStructure,
      },
    });

    return {
      id: brandVoice.id,
      name: brandVoice.name,
      toneProfile,
      vocabularyStyle,
      sentenceStructure,
    };
  }

  /**
   * AI-baserad analys av texter
   */
  private async analyzeWithAi(texts: string[]): Promise<{
    toneProfile: ToneProfile;
    vocabularyStyle: VocabularyStyle;
    sentenceStructure: SentenceStructure;
  }> {
    if (!this.openai) {
      throw new Error('OpenAI ej konfigurerad');
    }

    const combinedText = texts.join('\n\n---\n\n');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Du är en expertanalytiker för varumärkesröst och copywriting.
Analysera de givna texterna och returnera JSON med exakt denna struktur:
{
  "toneProfile": {
    "formal": 0.0-1.0,
    "friendly": 0.0-1.0,
    "technical": 0.0-1.0,
    "playful": 0.0-1.0,
    "professional": 0.0-1.0
  },
  "vocabularyStyle": {
    "preferredWords": ["ord1", "ord2", ...],
    "avoidWords": ["ord1", "ord2", ...],
    "industryTerms": ["term1", "term2", ...]
  },
  "sentenceStructure": {
    "avgLength": number,
    "complexity": "simple" | "medium" | "complex",
    "usesBulletPoints": boolean,
    "usesQuestions": boolean
  }
}`,
        },
        {
          role: 'user',
          content: `Analysera dessa texter och extrahera varumärkesröstens karaktäristik:\n\n${combinedText}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Inget svar från AI');
    }

    return JSON.parse(content);
  }

  /**
   * Manuell analys utan AI
   */
  private manualAnalyze(texts: string[]): {
    sentenceStructure: SentenceStructure;
    commonWords: string[];
  } {
    const combinedText = texts.join(' ');
    const sentences = combinedText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = combinedText.toLowerCase().split(/\s+/);

    // Räkna meningslängd
    const avgSentenceLength =
      sentences.length > 0
        ? sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length
        : 15;

    // Hitta vanliga ord (exkludera stoppord)
    const stopWords = new Set([
      'och',
      'i',
      'att',
      'en',
      'ett',
      'det',
      'som',
      'på',
      'är',
      'av',
      'för',
      'med',
      'den',
      'till',
      'de',
      'har',
      'vi',
      'kan',
      'om',
      'så',
      'men',
      'eller',
      'vara',
      'var',
      'inte',
      'din',
      'dina',
      'du',
      'dig',
    ]);

    const wordCount: Record<string, number> = {};
    for (const word of words) {
      if (word.length > 3 && !stopWords.has(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    }

    const commonWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    // Bestäm komplexitet
    let complexity: 'simple' | 'medium' | 'complex' = 'medium';
    if (avgSentenceLength < 10) complexity = 'simple';
    if (avgSentenceLength > 20) complexity = 'complex';

    return {
      sentenceStructure: {
        avgLength: Math.round(avgSentenceLength),
        complexity,
        usesBulletPoints: combinedText.includes('•') || combinedText.includes('-'),
        usesQuestions: combinedText.includes('?'),
      },
      commonWords,
    };
  }

  /**
   * Hämta alla Brand Voices för organisation
   */
  async listBrandVoices(organizationId: string) {
    return this.prisma.brandVoice.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        description: true,
        isDefault: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Sätt som standard Brand Voice
   */
  async setDefault(brandVoiceId: string, organizationId: string) {
    // Ta bort default från andra
    await this.prisma.brandVoice.updateMany({
      where: { organizationId },
      data: { isDefault: false },
    });

    // Sätt ny default
    return this.prisma.brandVoice.update({
      where: { id: brandVoiceId },
      data: { isDefault: true },
    });
  }

  /**
   * Ta bort Brand Voice
   */
  async deleteBrandVoice(brandVoiceId: string, organizationId: string) {
    const brandVoice = await this.prisma.brandVoice.findFirst({
      where: { id: brandVoiceId, organizationId },
    });

    if (!brandVoice) {
      throw new NotFoundException('Brand Voice hittades inte');
    }

    return this.prisma.brandVoice.delete({ where: { id: brandVoiceId } });
  }
}
