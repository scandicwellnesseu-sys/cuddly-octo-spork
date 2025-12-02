import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CompetitorAnalysisService, AnalyzeCompetitorDto } from './competitor-analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('competitor-analysis')
@UseGuards(JwtAuthGuard)
export class CompetitorAnalysisController {
  constructor(
    private readonly competitorAnalysisService: CompetitorAnalysisService,
  ) {}

  @Post('analyze')
  async analyzeCompetitor(
    @Request() req: { user: { organizationId: string } },
    @Body() dto: AnalyzeCompetitorDto,
  ) {
    return this.competitorAnalysisService.analyzeCompetitor(
      dto,
      req.user.organizationId,
    );
  }

  @Get()
  async getAnalyses(@Request() req: { user: { organizationId: string } }) {
    return this.competitorAnalysisService.getAnalyses(req.user.organizationId);
  }

  @Post(':id/compare')
  async compareWithCompetitor(
    @Param('id') id: string,
    @Request() req: { user: { organizationId: string } },
    @Body()
    body: {
      avgDescriptionLength: number;
      topKeywords: string[];
      avgSeoScore: number;
    },
  ) {
    return this.competitorAnalysisService.compareWithCompetitor(
      req.user.organizationId,
      id,
      body,
    );
  }
}
