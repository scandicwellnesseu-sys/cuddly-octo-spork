import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DashboardStats {
  totalGenerations: number;
  generationsThisMonth: number;
  avgSeoScore: number;
  creditsUsed: number;
  topCategories: { category: string; count: number }[];
  generationsByDay: { date: string; count: number }[];
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Hämta dashboard-statistik för organisation
   */
  async getDashboardStats(organizationId: string): Promise<DashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Totalt antal genereringar
    const totalGenerations = await this.prisma.generation.count({
      where: { organizationId },
    });

    // Genereringar denna månad
    const generationsThisMonth = await this.prisma.generation.count({
      where: {
        organizationId,
        createdAt: { gte: startOfMonth },
      },
    });

    // Genomsnittlig SEO-poäng
    const avgSeoResult = await this.prisma.generation.aggregate({
      where: {
        organizationId,
        seoScore: { not: null },
      },
      _avg: { seoScore: true },
    });
    const avgSeoScore = Math.round(avgSeoResult._avg.seoScore || 0);

    // Total credits använda
    const creditsResult = await this.prisma.generation.aggregate({
      where: { organizationId },
      _sum: { creditsUsed: true },
    });
    const creditsUsed = creditsResult._sum.creditsUsed || 0;

    // Top kategorier (från attributes JSON)
    const generations = await this.prisma.generation.findMany({
      where: {
        organizationId,
        attributes: { not: null },
      },
      select: { attributes: true },
    });

    const categoryCounts: Record<string, number> = {};
    for (const gen of generations) {
      const attrs = gen.attributes as { category?: string } | null;
      if (attrs?.category) {
        categoryCounts[attrs.category] = (categoryCounts[attrs.category] || 0) + 1;
      }
    }

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Genereringar per dag (senaste 30 dagarna)
    const dailyGenerations = await this.prisma.generation.groupBy({
      by: ['createdAt'],
      where: {
        organizationId,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    });

    // Aggregera per dag
    const dayMap: Record<string, number> = {};
    for (const gen of dailyGenerations) {
      const date = gen.createdAt.toISOString().split('T')[0];
      dayMap[date] = (dayMap[date] || 0) + gen._count;
    }

    const generationsByDay = Object.entries(dayMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));

    return {
      totalGenerations,
      generationsThisMonth,
      avgSeoScore,
      creditsUsed,
      topCategories,
      generationsByDay,
    };
  }

  /**
   * Logga händelse
   */
  async trackEvent(
    eventType: string,
    eventData?: Record<string, unknown>,
    organizationId?: string,
    userId?: string,
  ) {
    await this.prisma.analyticsEvent.create({
      data: {
        eventType,
        eventData: eventData || {},
        organizationId,
        userId,
      },
    });
  }

  /**
   * Hämta händelselogg
   */
  async getEvents(organizationId: string, eventType?: string, limit = 100) {
    return this.prisma.analyticsEvent.findMany({
      where: {
        organizationId,
        ...(eventType && { eventType }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Hämta användningsstatistik per användare
   */
  async getUserStats(organizationId: string) {
    const stats = await this.prisma.generation.groupBy({
      by: ['userId'],
      where: { organizationId },
      _count: true,
      _avg: { seoScore: true },
    });

    const userIds = stats.map((s) => s.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return stats.map((s) => ({
      user: userMap.get(s.userId),
      generationCount: s._count,
      avgSeoScore: Math.round(s._avg.seoScore || 0),
    }));
  }
}
