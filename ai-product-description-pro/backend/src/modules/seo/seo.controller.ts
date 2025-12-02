import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeoService, SeoAnalysisInput, SeoAnalysisResult } from './seo.service';

@ApiTags('seo')
@Controller('api/seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analysera SEO för innehåll' })
  @ApiResponse({ status: 200, description: 'SEO-analys returnerad' })
  analyze(@Body() input: SeoAnalysisInput): SeoAnalysisResult {
    return this.seoService.analyzeContent(input);
  }

  @Get('score')
  @ApiOperation({ summary: 'Beräkna snabb SEO-poäng' })
  calculateScore(
    @Query('title') title: string,
    @Query('description') description: string,
    @Query('metaDescription') metaDescription: string,
    @Query('keywords') keywords: string,
  ): { score: number } {
    const keywordList = keywords ? keywords.split(',').map((k) => k.trim()) : [];
    const score = this.seoService.calculateSeoScore({
      title,
      description,
      metaDescription,
      keywords: keywordList,
    });
    return { score };
  }

  @Post('sentiment')
  @ApiOperation({ summary: 'Analysera sentiment i text' })
  analyzeSentiment(@Body() body: { text: string }): { score: number; label: string } {
    return this.seoService.analyzeSentiment(body.text);
  }

  @Post('readability')
  @ApiOperation({ summary: 'Beräkna läsbarhet' })
  calculateReadability(@Body() body: { text: string }): { grade: string } {
    const grade = this.seoService.calculateReadability(body.text);
    return { grade };
  }
}
