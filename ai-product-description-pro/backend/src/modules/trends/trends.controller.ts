import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TrendsService, TrendingItem } from './trends.service';
import { Language } from '@prisma/client';

@ApiTags('trends')
@Controller('api/trends')
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @Get()
  @ApiOperation({ summary: 'Hämta trendande nyckelord' })
  @ApiQuery({ name: 'language', enum: Language, required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTrends(
    @Query('language') language?: Language,
    @Query('limit') limit?: string,
  ): Promise<TrendingItem[]> {
    return this.trendsService.getTrendingKeywords(
      language || Language.SV,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('category')
  @ApiOperation({ summary: 'Hämta trender per kategori' })
  @ApiQuery({ name: 'category', required: true })
  @ApiQuery({ name: 'language', enum: Language, required: false })
  async getByCategory(
    @Query('category') category: string,
    @Query('language') language?: Language,
  ): Promise<TrendingItem[]> {
    return this.trendsService.getTrendsByCategory(language || Language.SV, category);
  }

  @Get('source')
  @ApiOperation({ summary: 'Hämta trender per källa' })
  @ApiQuery({ name: 'source', required: true })
  @ApiQuery({ name: 'language', enum: Language, required: false })
  async getBySource(
    @Query('source') source: string,
    @Query('language') language?: Language,
  ): Promise<TrendingItem[]> {
    return this.trendsService.getTrendsBySource(language || Language.SV, source);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Hämta trend-statistik' })
  @ApiQuery({ name: 'language', enum: Language, required: false })
  async getStats(@Query('language') language?: Language) {
    return this.trendsService.getTrendStats(language || Language.SV);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Uppdatera trender (admin)' })
  @ApiQuery({ name: 'language', enum: Language, required: false })
  async refresh(@Query('language') language?: Language) {
    await this.trendsService.refreshTrends(language || Language.SV);
    return { success: true };
  }
}
