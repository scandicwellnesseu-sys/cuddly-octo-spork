import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Language } from '@prisma/client';

export interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  relevanceScore: number;
}

export interface LongTailKeyword {
  keyword: string;
  parentKeyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
}

@Injectable()
export class KeywordsService {
  private readonly logger = new Logger(KeywordsService.name);

  // Cache för vanliga svenska e-handelsrelaterade nyckelord
  private readonly commonKeywords: Record<string, string[]> = {
    kläder: ['ekologisk', 'hållbar', 'bomull', 'unisex', 'minimalistisk', 'skandinavisk design'],
    kosmetika: ['naturlig', 'vegansk', 'cruelty-free', 'ekologisk', 'hudvänlig', 'sensitiv'],
    elektronik: ['trådlös', 'smart', 'energieffektiv', 'USB-C', 'Bluetooth', 'portabel'],
    hem: ['hållbar', 'minimalistisk', 'nordisk design', 'miljövänlig', 'handgjord', 'tidlös'],
    sport: ['prestanda', 'andningsaktiv', 'slitstark', 'ergonomisk', 'lätt', 'flexibel'],
    mat: ['ekologisk', 'glutenfri', 'vegansk', 'sockerfri', 'näringsrik', 'färsk'],
    barn: ['säker', 'lekfull', 'pedagogisk', 'ekologisk', 'certifierad', 'mjuk'],
  };

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Hämta förslag på relevanta long-tail nyckelord
   */
  async getSuggestedKeywords(existingKeywords: string[], language: Language): Promise<string[]> {
    const suggestions: string[] = [];

    // Analysera befintliga nyckelord och hitta relaterade
    for (const keyword of existingKeywords) {
      const related = this.findRelatedKeywords(keyword);
      suggestions.push(...related);
    }

    // Hämta trendande nyckelord från databasen
    const trending = await this.prisma.trendingKeyword.findMany({
      where: {
        language,
        expiresAt: { gt: new Date() },
      },
      orderBy: { trendScore: 'desc' },
      take: 10,
    });

    suggestions.push(...trending.map((t) => t.keyword));

    // Ta bort dubbletter och befintliga nyckelord
    const unique = [...new Set(suggestions)].filter(
      (s) => !existingKeywords.some((ek) => ek.toLowerCase() === s.toLowerCase()),
    );

    return unique.slice(0, 10);
  }

  /**
   * Hitta relaterade nyckelord baserat på kategori
   */
  private findRelatedKeywords(keyword: string): string[] {
    const lowerKeyword = keyword.toLowerCase();

    for (const [category, keywords] of Object.entries(this.commonKeywords)) {
      if (lowerKeyword.includes(category) || keywords.some((k) => lowerKeyword.includes(k))) {
        return keywords.filter((k) => !lowerKeyword.includes(k));
      }
    }

    return [];
  }

  /**
   * Generera long-tail nyckelord variationer
   */
  async generateLongTailKeywords(
    baseKeyword: string,
    language: Language,
  ): Promise<LongTailKeyword[]> {
    const prefixes: Record<Language, string[]> = {
      SV: ['köp', 'bästa', 'billig', 'kvalitet', 'svenska', 'online'],
      EN: ['buy', 'best', 'cheap', 'quality', 'premium', 'online'],
      NO: ['kjøp', 'beste', 'billig', 'kvalitet', 'norsk', 'online'],
      DA: ['køb', 'bedste', 'billig', 'kvalitet', 'dansk', 'online'],
      FI: ['osta', 'paras', 'halpa', 'laatu', 'suomalainen', 'verkossa'],
      DE: ['kaufen', 'beste', 'günstig', 'qualität', 'premium', 'online'],
    };

    const suffixes: Record<Language, string[]> = {
      SV: ['fri frakt', 'snabb leverans', '2024', 'test', 'recension'],
      EN: ['free shipping', 'fast delivery', '2024', 'review', 'guide'],
      NO: ['gratis frakt', 'rask levering', '2024', 'test', 'anmeldelse'],
      DA: ['gratis fragt', 'hurtig levering', '2024', 'test', 'anmeldelse'],
      FI: ['ilmainen toimitus', 'nopea toimitus', '2024', 'arvostelu', 'opas'],
      DE: ['kostenloser versand', 'schnelle lieferung', '2024', 'test', 'bewertung'],
    };

    const langPrefixes = prefixes[language] || prefixes.SV;
    const langSuffixes = suffixes[language] || suffixes.SV;
    const results: LongTailKeyword[] = [];

    // Generera kombinationer
    for (const prefix of langPrefixes) {
      results.push({
        keyword: `${prefix} ${baseKeyword}`,
        parentKeyword: baseKeyword,
        searchVolume: Math.floor(Math.random() * 1000) + 100,
        competition: this.randomCompetition(),
      });
    }

    for (const suffix of langSuffixes) {
      results.push({
        keyword: `${baseKeyword} ${suffix}`,
        parentKeyword: baseKeyword,
        searchVolume: Math.floor(Math.random() * 800) + 50,
        competition: this.randomCompetition(),
      });
    }

    return results;
  }

  private randomCompetition(): 'low' | 'medium' | 'high' {
    const rand = Math.random();
    if (rand < 0.33) return 'low';
    if (rand < 0.66) return 'medium';
    return 'high';
  }

  /**
   * Analysera nyckelordskonkurrens
   */
  async analyzeKeywordCompetition(
    keyword: string,
  ): Promise<{ difficulty: number; opportunity: number; suggestions: string[] }> {
    // I produktion skulle detta kopplas till Semrush/Ahrefs API
    const difficulty = Math.floor(Math.random() * 100);
    const opportunity = 100 - difficulty;

    const suggestions = await this.generateLongTailKeywords(keyword, Language.SV);

    return {
      difficulty,
      opportunity,
      suggestions: suggestions
        .filter((s) => s.competition === 'low')
        .map((s) => s.keyword)
        .slice(0, 5),
    };
  }

  /**
   * Hämta populära nyckelord per kategori
   */
  async getPopularKeywordsByCategory(
    category: string,
    language: Language,
  ): Promise<KeywordSuggestion[]> {
    const categoryKeywords = this.commonKeywords[category.toLowerCase()] || [];

    return categoryKeywords.map((keyword) => ({
      keyword,
      searchVolume: Math.floor(Math.random() * 5000) + 500,
      difficulty: Math.floor(Math.random() * 100),
      relevanceScore: Math.random() * 0.5 + 0.5,
    }));
  }

  /**
   * Uppdatera trendande nyckelord i databasen
   */
  async updateTrendingKeywords(
    keywords: { keyword: string; trendScore: number; source: string }[],
    language: Language,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Gäller 24 timmar

    for (const kw of keywords) {
      await this.prisma.trendingKeyword.upsert({
        where: {
          keyword_language: {
            keyword: kw.keyword,
            language,
          },
        },
        update: {
          trendScore: kw.trendScore,
          source: kw.source,
          fetchedAt: new Date(),
          expiresAt,
        },
        create: {
          keyword: kw.keyword,
          language,
          trendScore: kw.trendScore,
          source: kw.source,
          expiresAt,
        },
      });
    }
  }
}
