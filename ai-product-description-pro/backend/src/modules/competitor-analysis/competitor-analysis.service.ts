import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';

export interface AnalyzeCompetitorDto {
  competitorUrl: string;
  competitorName?: string;
}

export interface CompetitorInsights {
  id: string;
  competitorName: string;
  summary: {
    productCount: number;
    avgDescriptionLength: number;
    topKeywords: string[];
    toneProfile: {
      formal: number;
      casual: number;
      technical: number;
      emotional: number;
    };
    seoAnalysis: {
      avgScore: number;
      hasMetaDescriptions: boolean;
      hasStructuredData: boolean;
    };
    priceRange: {
      min: number;
      max: number;
      avg: number;
      currency: string;
    };
  };
  recommendations: string[];
  opportunities: string[];
}

@Injectable()
export class CompetitorAnalysisService {
  private readonly logger = new Logger(CompetitorAnalysisService.name);
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
   * Starta analys av konkurrent
   */
  async analyzeCompetitor(
    dto: AnalyzeCompetitorDto,
    organizationId: string,
  ): Promise<CompetitorInsights> {
    this.logger.log(`Analyserar konkurrent: ${dto.competitorUrl}`);

    // Skapa analyspost
    const analysis = await this.prisma.competitorAnalysis.create({
      data: {
        organizationId,
        competitorUrl: dto.competitorUrl,
        competitorName: dto.competitorName,
        status: 'ANALYZING',
      },
    });

    try {
      // Extrahera data från konkurrentens webbplats
      // I produktion: använd web scraping service
      const scrapedData = await this.scrapeCompetitor(dto.competitorUrl);

      // Analysera med AI
      const aiAnalysis = await this.analyzeWithAI(scrapedData);

      // Uppdatera databas
      await this.prisma.competitorAnalysis.update({
        where: { id: analysis.id },
        data: {
          competitorName: dto.competitorName || aiAnalysis.competitorName,
          productCount: aiAnalysis.productCount,
          avgDescLength: aiAnalysis.avgDescriptionLength,
          topKeywords: aiAnalysis.topKeywords,
          toneAnalysis: aiAnalysis.toneProfile,
          seoAnalysis: aiAnalysis.seoAnalysis,
          priceRange: aiAnalysis.priceRange,
          status: 'COMPLETED',
          analyzedAt: new Date(),
        },
      });

      return {
        id: analysis.id,
        competitorName: dto.competitorName || aiAnalysis.competitorName || 'Konkurrent',
        summary: {
          productCount: aiAnalysis.productCount,
          avgDescriptionLength: aiAnalysis.avgDescriptionLength,
          topKeywords: aiAnalysis.topKeywords,
          toneProfile: aiAnalysis.toneProfile,
          seoAnalysis: aiAnalysis.seoAnalysis,
          priceRange: aiAnalysis.priceRange,
        },
        recommendations: aiAnalysis.recommendations,
        opportunities: aiAnalysis.opportunities,
      };
    } catch (error) {
      await this.prisma.competitorAnalysis.update({
        where: { id: analysis.id },
        data: { status: 'FAILED' },
      });
      this.logger.error('Konkurrentanalys misslyckades:', error);
      throw error;
    }
  }

  /**
   * Hämta tidigare analyser
   */
  async getAnalyses(organizationId: string) {
    return this.prisma.competitorAnalysis.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Jämför din butik med konkurrent
   */
  async compareWithCompetitor(
    organizationId: string,
    competitorAnalysisId: string,
    yourMetrics: {
      avgDescriptionLength: number;
      topKeywords: string[];
      avgSeoScore: number;
    },
  ): Promise<{
    comparison: Record<string, { you: number; competitor: number; winner: string }>;
    suggestions: string[];
  }> {
    const competitor = await this.prisma.competitorAnalysis.findUnique({
      where: { id: competitorAnalysisId },
    });

    if (!competitor) {
      throw new Error('Konkurrentanalys hittades inte');
    }

    const seoAnalysis = competitor.seoAnalysis as { avgScore?: number } | null;
    const competitorAvgSeo = seoAnalysis?.avgScore || 0;

    const comparison = {
      descriptionLength: {
        you: yourMetrics.avgDescriptionLength,
        competitor: competitor.avgDescLength || 0,
        winner: yourMetrics.avgDescriptionLength > (competitor.avgDescLength || 0) ? 'you' : 'competitor',
      },
      seoScore: {
        you: yourMetrics.avgSeoScore,
        competitor: competitorAvgSeo,
        winner: yourMetrics.avgSeoScore > competitorAvgSeo ? 'you' : 'competitor',
      },
      keywordCount: {
        you: yourMetrics.topKeywords.length,
        competitor: competitor.topKeywords?.length || 0,
        winner: yourMetrics.topKeywords.length > (competitor.topKeywords?.length || 0) ? 'you' : 'competitor',
      },
    };

    const suggestions = this.generateComparisonSuggestions(comparison, competitor);

    return { comparison, suggestions };
  }

  /**
   * Scrapa konkurrentdata
   * I produktion: använd Puppeteer, Playwright eller scraping-tjänst
   */
  private async scrapeCompetitor(url: string): Promise<{
    products: { title: string; description: string; price?: number }[];
    metadata: { title: string; description?: string };
  }> {
    // Simulerad data - i produktion integrera med:
    // - Puppeteer/Playwright för dynamiskt innehåll
    // - Apify, ScrapingBee eller liknande tjänst
    // - RSS-feeds om tillgängligt

    this.logger.log(`Skulle scrapa: ${url}`);

    // Returnera simulerad data för demo
    return {
      products: [
        {
          title: 'Exempelprodukt 1',
          description: 'En fantastisk produkt med hög kvalitet och modern design.',
          price: 299,
        },
        {
          title: 'Exempelprodukt 2',
          description: 'Premium-kvalitet för den kräsne kunden som söker det bästa.',
          price: 599,
        },
      ],
      metadata: {
        title: 'Konkurrent AB',
        description: 'Vi säljer kvalitetsprodukter',
      },
    };
  }

  /**
   * Analysera scrapad data med AI
   */
  private async analyzeWithAI(data: {
    products: { title: string; description: string; price?: number }[];
    metadata: { title: string; description?: string };
  }): Promise<{
    competitorName?: string;
    productCount: number;
    avgDescriptionLength: number;
    topKeywords: string[];
    toneProfile: {
      formal: number;
      casual: number;
      technical: number;
      emotional: number;
    };
    seoAnalysis: {
      avgScore: number;
      hasMetaDescriptions: boolean;
      hasStructuredData: boolean;
    };
    priceRange: {
      min: number;
      max: number;
      avg: number;
      currency: string;
    };
    recommendations: string[];
    opportunities: string[];
  }> {
    // Beräkna grundläggande statistik
    const productCount = data.products.length;
    const descriptions = data.products.map((p) => p.description);
    const avgDescriptionLength = Math.round(
      descriptions.reduce((sum, d) => sum + d.length, 0) / descriptions.length,
    );

    const prices = data.products.filter((p) => p.price).map((p) => p.price as number);
    const priceRange = {
      min: Math.min(...prices) || 0,
      max: Math.max(...prices) || 0,
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) || 0,
      currency: 'SEK',
    };

    // Använd AI för djupare analys
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Analysera dessa produktbeskrivningar från en konkurrent.
Returnera JSON med:
- topKeywords: array av de 10 mest använda nyckelorden
- toneProfile: { formal: 0-1, casual: 0-1, technical: 0-1, emotional: 0-1 }
- avgSeoScore: uppskattad SEO-poäng 0-100
- recommendations: array av 3-5 rekommendationer för att konkurrera bättre
- opportunities: array av 2-3 möjligheter att differentiera sig`,
            },
            {
              role: 'user',
              content: `Konkurrent: ${data.metadata.title}\n\nProduktbeskrivningar:\n${descriptions.join('\n\n')}`,
            },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 1000,
        });

        const aiResult = JSON.parse(response.choices[0]?.message?.content || '{}');

        return {
          competitorName: data.metadata.title,
          productCount,
          avgDescriptionLength,
          topKeywords: aiResult.topKeywords || [],
          toneProfile: aiResult.toneProfile || { formal: 0.5, casual: 0.5, technical: 0.3, emotional: 0.4 },
          seoAnalysis: {
            avgScore: aiResult.avgSeoScore || 70,
            hasMetaDescriptions: true,
            hasStructuredData: false,
          },
          priceRange,
          recommendations: aiResult.recommendations || [],
          opportunities: aiResult.opportunities || [],
        };
      } catch (error) {
        this.logger.error('AI-analys misslyckades:', error);
      }
    }

    // Fallback utan AI
    return {
      competitorName: data.metadata.title,
      productCount,
      avgDescriptionLength,
      topKeywords: ['kvalitet', 'premium', 'design', 'modern', 'hållbar'],
      toneProfile: { formal: 0.5, casual: 0.5, technical: 0.3, emotional: 0.4 },
      seoAnalysis: {
        avgScore: 70,
        hasMetaDescriptions: true,
        hasStructuredData: false,
      },
      priceRange,
      recommendations: [
        'Skriv längre och mer detaljerade produktbeskrivningar',
        'Inkludera fler nyckelord naturligt i texten',
        'Lägg till strukturerad data för bättre SEO',
      ],
      opportunities: [
        'Fokusera på unika produktegenskaper',
        'Använd mer emotionellt språk för att skapa engagemang',
      ],
    };
  }

  /**
   * Generera jämförelseförslag
   */
  private generateComparisonSuggestions(
    comparison: Record<string, { you: number; competitor: number; winner: string }>,
    competitor: { topKeywords: string[] | null },
  ): string[] {
    const suggestions: string[] = [];

    if (comparison.descriptionLength.winner === 'competitor') {
      suggestions.push(
        `Öka längden på dina produktbeskrivningar med ${comparison.descriptionLength.competitor - comparison.descriptionLength.you} tecken i snitt`,
      );
    }

    if (comparison.seoScore.winner === 'competitor') {
      suggestions.push('Förbättra din SEO genom att optimera meta-titlar och beskrivningar');
    }

    if (competitor.topKeywords && competitor.topKeywords.length > 0) {
      suggestions.push(
        `Överväg att använda dessa populära nyckelord: ${competitor.topKeywords.slice(0, 5).join(', ')}`,
      );
    }

    if (suggestions.length === 0) {
      suggestions.push('Du ligger bra till jämfört med konkurrenten! Fortsätt så.');
    }

    return suggestions;
  }
}
