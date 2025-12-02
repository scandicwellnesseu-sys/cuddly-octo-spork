import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Language } from '@prisma/client';

export interface TrendingItem {
  keyword: string;
  trendScore: number;
  searchVolume?: number;
  source: string;
  category?: string;
  change: 'up' | 'down' | 'stable';
}

@Injectable()
export class TrendsService {
  private readonly logger = new Logger(TrendsService.name);

  // Simulerad trenddata för demo
  private readonly mockTrends: Record<Language, TrendingItem[]> = {
    SV: [
      { keyword: 'hållbart mode', trendScore: 95, searchVolume: 12000, source: 'google', category: 'kläder', change: 'up' },
      { keyword: 'ekologisk hudvård', trendScore: 88, searchVolume: 8500, source: 'instagram', category: 'kosmetika', change: 'up' },
      { keyword: 'minimalistisk inredning', trendScore: 82, searchVolume: 6200, source: 'pinterest', category: 'hem', change: 'stable' },
      { keyword: 'vegansk kosttillskott', trendScore: 79, searchVolume: 5400, source: 'google', category: 'hälsa', change: 'up' },
      { keyword: 'smart hem', trendScore: 76, searchVolume: 9800, source: 'tiktok', category: 'elektronik', change: 'up' },
      { keyword: 'secondhand kläder', trendScore: 74, searchVolume: 7200, source: 'instagram', category: 'kläder', change: 'up' },
      { keyword: 'nordisk design', trendScore: 71, searchVolume: 4300, source: 'pinterest', category: 'hem', change: 'stable' },
      { keyword: 'wellness retreat', trendScore: 68, searchVolume: 3100, source: 'google', category: 'hälsa', change: 'down' },
      { keyword: 'återvunnet material', trendScore: 65, searchVolume: 2800, source: 'instagram', category: 'kläder', change: 'up' },
      { keyword: 'naturlig parfym', trendScore: 62, searchVolume: 2400, source: 'tiktok', category: 'kosmetika', change: 'up' },
    ],
    EN: [
      { keyword: 'sustainable fashion', trendScore: 94, searchVolume: 45000, source: 'google', category: 'clothing', change: 'up' },
      { keyword: 'clean beauty', trendScore: 91, searchVolume: 38000, source: 'instagram', category: 'cosmetics', change: 'up' },
      { keyword: 'minimalist home', trendScore: 85, searchVolume: 28000, source: 'pinterest', category: 'home', change: 'stable' },
      { keyword: 'plant-based supplements', trendScore: 82, searchVolume: 22000, source: 'google', category: 'health', change: 'up' },
      { keyword: 'smart home devices', trendScore: 79, searchVolume: 52000, source: 'tiktok', category: 'electronics', change: 'up' },
      { keyword: 'thrift fashion', trendScore: 77, searchVolume: 31000, source: 'instagram', category: 'clothing', change: 'up' },
      { keyword: 'scandinavian design', trendScore: 73, searchVolume: 18000, source: 'pinterest', category: 'home', change: 'stable' },
      { keyword: 'wellness retreat', trendScore: 70, searchVolume: 15000, source: 'google', category: 'health', change: 'down' },
      { keyword: 'recycled materials', trendScore: 68, searchVolume: 12000, source: 'instagram', category: 'clothing', change: 'up' },
      { keyword: 'natural fragrance', trendScore: 64, searchVolume: 9500, source: 'tiktok', category: 'cosmetics', change: 'up' },
    ],
    NO: [],
    DA: [],
    FI: [],
    DE: [],
  };

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Hämta trendande nyckelord
   */
  async getTrendingKeywords(language: Language, limit = 10): Promise<TrendingItem[]> {
    // Försök hämta från databasen först
    const dbTrends = await this.prisma.trendingKeyword.findMany({
      where: {
        language,
        expiresAt: { gt: new Date() },
      },
      orderBy: { trendScore: 'desc' },
      take: limit,
    });

    if (dbTrends.length >= limit) {
      return dbTrends.map((t) => ({
        keyword: t.keyword,
        trendScore: t.trendScore || 0,
        searchVolume: t.searchVolume || undefined,
        source: t.source || 'database',
        category: t.category || undefined,
        change: 'stable' as const,
      }));
    }

    // Använd mock-data om databasen är tom
    const mockData = this.mockTrends[language] || this.mockTrends.SV;
    return mockData.slice(0, limit);
  }

  /**
   * Hämta trender för specifik kategori
   */
  async getTrendsByCategory(
    language: Language,
    category: string,
    limit = 10,
  ): Promise<TrendingItem[]> {
    const allTrends = await this.getTrendingKeywords(language, 50);
    return allTrends.filter((t) => t.category === category).slice(0, limit);
  }

  /**
   * Hämta trender från specifik källa
   */
  async getTrendsBySource(
    language: Language,
    source: string,
    limit = 10,
  ): Promise<TrendingItem[]> {
    const allTrends = await this.getTrendingKeywords(language, 50);
    return allTrends.filter((t) => t.source === source).slice(0, limit);
  }

  /**
   * Uppdatera trender (skulle kopplas till externa API:er)
   */
  async refreshTrends(language: Language): Promise<void> {
    this.logger.log(`Uppdaterar trender för ${language}`);

    // I produktion skulle detta kopplas till:
    // - Google Trends API
    // - TikTok API
    // - Instagram Graph API
    // - SEMrush/Ahrefs API

    const mockData = this.mockTrends[language] || this.mockTrends.SV;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6); // Gäller 6 timmar

    for (const trend of mockData) {
      await this.prisma.trendingKeyword.upsert({
        where: {
          keyword_language: {
            keyword: trend.keyword,
            language,
          },
        },
        update: {
          trendScore: trend.trendScore,
          searchVolume: trend.searchVolume,
          source: trend.source,
          category: trend.category,
          fetchedAt: new Date(),
          expiresAt,
        },
        create: {
          keyword: trend.keyword,
          language,
          trendScore: trend.trendScore,
          searchVolume: trend.searchVolume,
          source: trend.source,
          category: trend.category,
          expiresAt,
        },
      });
    }
  }

  /**
   * Hämta trend-statistik
   */
  async getTrendStats(language: Language) {
    const trends = await this.getTrendingKeywords(language, 50);

    const bySource: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let upCount = 0;
    let downCount = 0;

    for (const trend of trends) {
      bySource[trend.source] = (bySource[trend.source] || 0) + 1;
      if (trend.category) {
        byCategory[trend.category] = (byCategory[trend.category] || 0) + 1;
      }
      if (trend.change === 'up') upCount++;
      if (trend.change === 'down') downCount++;
    }

    return {
      total: trends.length,
      bySource,
      byCategory,
      momentum: { up: upCount, down: downCount, stable: trends.length - upCount - downCount },
    };
  }
}
