import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AiService, GenerationResult } from './ai.service';
import { GenerateProductDto, RewriteTextDto, TranslateDto, BulkGenerateDto } from './dto/generate-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Language } from '@prisma/client';

interface AuthenticatedRequest {
  user: {
    sub: string;
    organizationId: string;
  };
}

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generera produktbeskrivning från bild och nyckelord' })
  @ApiResponse({ status: 201, description: 'Produktbeskrivning genererad' })
  async generate(
    @Body() dto: GenerateProductDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<GenerationResult> {
    return this.aiService.generateProductDescription(
      dto,
      req.user.sub,
      req.user.organizationId,
    );
  }

  @Post('generate/bulk')
  @ApiOperation({ summary: 'Generera flera produktbeskrivningar i bulk' })
  @ApiResponse({ status: 201, description: 'Bulk-generering startad' })
  async bulkGenerate(
    @Body() dto: BulkGenerateDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ results: GenerationResult[]; failed: number }> {
    const results: GenerationResult[] = [];
    let failed = 0;

    for (const product of dto.products) {
      try {
        const result = await this.aiService.generateProductDescription(
          product,
          req.user.sub,
          req.user.organizationId,
        );
        results.push(result);
      } catch {
        failed++;
      }
    }

    return { results, failed };
  }

  @Post('rewrite')
  @ApiOperation({ summary: 'Förbättra befintlig produkttext' })
  @ApiResponse({ status: 200, description: 'Text förbättrad' })
  async rewrite(@Body() dto: RewriteTextDto): Promise<{ text: string }> {
    const text = await this.aiService.rewriteText(
      dto.existingText,
      dto.improvements,
      dto.language || Language.SV,
    );
    return { text };
  }

  @Post('translate')
  @ApiOperation({ summary: 'Översätt genererad produkttext' })
  @ApiResponse({ status: 200, description: 'Text översatt' })
  async translate(@Body() dto: TranslateDto): Promise<GenerationResult> {
    return this.aiService.translateGeneration(dto.generationId, dto.targetLanguage);
  }
}
