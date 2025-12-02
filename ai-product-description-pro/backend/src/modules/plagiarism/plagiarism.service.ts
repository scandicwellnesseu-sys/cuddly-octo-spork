import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';

export interface PlagiarismCheckResult {
  id: string;
  uniquenessScore: number;
  matches: {
    source: string;
    similarity: number;
    snippet: string;
  }[];
  isUnique: boolean;
  recommendations: string[];
}

@Injectable()
export class PlagiarismService {
  private readonly logger = new Logger(PlagiarismService.name);
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
   * Kontrollera text för plagiat
   */
  async checkPlagiarism(
    content: string,
    organizationId: string,
    generationId?: string,
  ): Promise<PlagiarismCheckResult> {
    this.logger.log('Startar plagiatkontroll...');

    // Skapa post i databasen
    const check = await this.prisma.plagiarismCheck.create({
      data: {
        organizationId,
        generationId,
        content,
        status: 'CHECKING',
      },
    });

    try {
      // Använd AI för att analysera textens unikhet
      const analysis = await this.analyzeWithAI(content);

      // Simulera kontroll mot externa källor
      // I produktion: integrera med Copyscape, Grammarly, eller liknande
      const externalMatches = await this.checkExternalSources(content);

      const uniquenessScore = this.calculateUniquenessScore(analysis, externalMatches);
      const matches = this.formatMatches(externalMatches);

      // Uppdatera databas
      await this.prisma.plagiarismCheck.update({
        where: { id: check.id },
        data: {
          uniquenessScore,
          matches,
          status: 'COMPLETED',
          checkedAt: new Date(),
        },
      });

      const isUnique = uniquenessScore >= 90;

      return {
        id: check.id,
        uniquenessScore,
        matches,
        isUnique,
        recommendations: this.generateRecommendations(uniquenessScore, matches),
      };
    } catch (error) {
      await this.prisma.plagiarismCheck.update({
        where: { id: check.id },
        data: { status: 'FAILED' },
      });
      this.logger.error('Plagiatkontroll misslyckades:', error);
      throw error;
    }
  }

  /**
   * Hämta tidigare kontroller för organisation
   */
  async getChecks(organizationId: string, limit = 20) {
    return this.prisma.plagiarismCheck.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Analysera text med AI för mönster som indikerar plagiat
   */
  private async analyzeWithAI(content: string): Promise<{
    originalityScore: number;
    flags: string[];
  }> {
    if (!this.openai) {
      return { originalityScore: 85, flags: [] };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Du är expert på att identifiera plagiat och kopierad text.
Analysera texten och returnera JSON med:
- originalityScore: 0-100 (100 = helt unik)
- flags: array av varningar (t.ex. "Generisk frasering", "Vanliga klichéer")

Var kritisk men rättvis. Produkttexter kan innehålla standardfraser.`,
          },
          {
            role: 'user',
            content: `Analysera denna text för originalitet:\n\n${content}`,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{}');
      return {
        originalityScore: result.originalityScore || 85,
        flags: result.flags || [],
      };
    } catch (error) {
      this.logger.error('AI-analys misslyckades:', error);
      return { originalityScore: 85, flags: [] };
    }
  }

  /**
   * Kontrollera mot externa källor
   * I produktion: använd Copyscape API, Google Custom Search, etc.
   */
  private async checkExternalSources(content: string): Promise<{
    source: string;
    similarity: number;
    matchedText: string;
  }[]> {
    // Simulerad kontroll - i produktion integrera med:
    // - Copyscape API
    // - Google Custom Search
    // - Grammarly Plagiarism Checker
    // - Turnitin (för akademisk text)

    // Extrahera fraser att söka efter
    const phrases = this.extractSearchPhrases(content);

    // Simulera inga matchningar för demo
    // I produktion: sök varje fras online
    return [];
  }

  /**
   * Extrahera sökbara fraser från text
   */
  private extractSearchPhrases(content: string): string[] {
    // Ta ut unika fraser på 5-10 ord
    const words = content.split(/\s+/);
    const phrases: string[] = [];

    for (let i = 0; i < words.length - 5; i += 10) {
      const phrase = words.slice(i, i + 7).join(' ');
      if (phrase.length > 20) {
        phrases.push(phrase);
      }
    }

    return phrases.slice(0, 10); // Max 10 fraser
  }

  /**
   * Beräkna slutgiltig unikhetspoäng
   */
  private calculateUniquenessScore(
    aiAnalysis: { originalityScore: number; flags: string[] },
    externalMatches: { similarity: number }[],
  ): number {
    let score = aiAnalysis.originalityScore;

    // Dra av för varje extern match
    for (const match of externalMatches) {
      score -= match.similarity * 0.5;
    }

    // Dra av för AI-flaggor
    score -= aiAnalysis.flags.length * 2;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Formatera matchningar för svar
   */
  private formatMatches(
    externalMatches: { source: string; similarity: number; matchedText: string }[],
  ): { source: string; similarity: number; snippet: string }[] {
    return externalMatches.map((m) => ({
      source: m.source,
      similarity: m.similarity,
      snippet: m.matchedText.substring(0, 200),
    }));
  }

  /**
   * Generera rekommendationer baserat på resultat
   */
  private generateRecommendations(
    uniquenessScore: number,
    matches: { source: string; similarity: number }[],
  ): string[] {
    const recommendations: string[] = [];

    if (uniquenessScore >= 95) {
      recommendations.push('Texten är unik och redo att publiceras');
    } else if (uniquenessScore >= 80) {
      recommendations.push('Texten är mestadels unik men kan förbättras');
      recommendations.push('Överväg att omformulera generiska fraser');
    } else if (uniquenessScore >= 60) {
      recommendations.push('Texten innehåller för många likheter med befintligt innehåll');
      recommendations.push('Skriv om texten med mer unika formuleringar');
    } else {
      recommendations.push('Texten måste skrivas om helt');
      recommendations.push('Undvik att kopiera struktur från andra texter');
    }

    if (matches.length > 0) {
      recommendations.push(`Hittade ${matches.length} liknande texter online`);
    }

    return recommendations;
  }

  /**
   * Jämför två texter för likhet
   */
  async compareTexts(text1: string, text2: string): Promise<{
    similarity: number;
    commonPhrases: string[];
  }> {
    // Beräkna Jaccard-likhet
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    const similarity = (intersection.size / union.size) * 100;

    // Hitta gemensamma fraser
    const commonPhrases: string[] = [];
    const phrases1 = this.extractSearchPhrases(text1);

    for (const phrase of phrases1) {
      if (text2.toLowerCase().includes(phrase.toLowerCase())) {
        commonPhrases.push(phrase);
      }
    }

    return {
      similarity: Math.round(similarity),
      commonPhrases,
    };
  }
}
