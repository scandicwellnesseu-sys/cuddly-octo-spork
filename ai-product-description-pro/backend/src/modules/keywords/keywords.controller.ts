import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { KeywordsService, KeywordSuggestion, LongTailKeyword } from './keywords.service';
import { Language } from '@prisma/client';

@ApiTags('keywords')
@Controller('api/keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Get('suggestions')
  @ApiOperation({ summary: 'Hämta nyckelordsförslag baserat på befintliga nyckelord' })
  @ApiQuery({ name: 'keywords', required: false, type: String, description: 'Kommaseparerade nyckelord' })
  @ApiQuery({ name: 'language', required: false, enum: Language })
  async getSuggestions(
    @Query('keywords') keywords?: string,
    @Query('language') language?: Language,
  ): Promise<string[]> {
    const keywordList = keywords ? keywords.split(',').map((k) => k.trim()) : [];
    return this.keywordsService.getSuggestedKeywords(keywordList, language || Language.SV);
  }

  @Get('long-tail')
  @ApiOperation({ summary: 'Generera long-tail nyckelord variationer' })
  @ApiQuery({ name: 'keyword', required: true })
  @ApiQuery({ name: 'language', required: false, enum: Language })
  async getLongTailKeywords(
    @Query('keyword') keyword: string,
    @Query('language') language?: Language,
  ): Promise<LongTailKeyword[]> {
    return this.keywordsService.generateLongTailKeywords(keyword, language || Language.SV);
  }

  @Get('competition')
  @ApiOperation({ summary: 'Analysera nyckelordskonkurrens' })
  @ApiQuery({ name: 'keyword', required: true })
  async analyzeCompetition(
    @Query('keyword') keyword: string,
  ): Promise<{ difficulty: number; opportunity: number; suggestions: string[] }> {
    return this.keywordsService.analyzeKeywordCompetition(keyword);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Hämta populära nyckelord per kategori' })
  @ApiQuery({ name: 'category', required: true })
  @ApiQuery({ name: 'language', required: false, enum: Language })
  async getPopularByCategory(
    @Query('category') category: string,
    @Query('language') language?: Language,
  ): Promise<KeywordSuggestion[]> {
    return this.keywordsService.getPopularKeywordsByCategory(category, language || Language.SV);
  }

  @Post('trending/update')
  @ApiOperation({ summary: 'Uppdatera trendande nyckelord (intern användning)' })
  async updateTrending(
    @Body()
    body: {
      keywords: { keyword: string; trendScore: number; source: string }[];
      language: Language;
    },
  ): Promise<{ success: boolean }> {
    await this.keywordsService.updateTrendingKeywords(body.keywords, body.language);
    return { success: true };
  }
}
