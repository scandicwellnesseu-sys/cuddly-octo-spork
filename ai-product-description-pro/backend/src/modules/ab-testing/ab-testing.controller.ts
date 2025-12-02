import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AbTestingService, CreateAbTestDto } from './ab-testing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ab-testing')
@UseGuards(JwtAuthGuard)
export class AbTestingController {
  constructor(private readonly abTestingService: AbTestingService) {}

  @Post()
  async createTest(
    @Request() req: { user: { organizationId: string } },
    @Body() dto: CreateAbTestDto,
  ) {
    return this.abTestingService.createTest(req.user.organizationId, dto);
  }

  @Get()
  async getTests(@Request() req: { user: { organizationId: string } }) {
    return this.abTestingService.getTests(req.user.organizationId);
  }

  @Put(':id/start')
  async startTest(@Param('id') id: string) {
    return this.abTestingService.startTest(id);
  }

  @Put(':id/pause')
  async pauseTest(@Param('id') id: string) {
    return this.abTestingService.pauseTest(id);
  }

  @Put(':id/complete')
  async completeTest(@Param('id') id: string) {
    return this.abTestingService.completeTest(id);
  }

  @Get(':testId/variant')
  async getVariant(@Param('testId') testId: string) {
    const variantId = await this.abTestingService.getVariantForDisplay(testId);
    return { variantId };
  }

  @Post('variants/:variantId/impression')
  async recordImpression(@Param('variantId') variantId: string) {
    await this.abTestingService.recordImpression(variantId);
    return { success: true };
  }

  @Post('variants/:variantId/click')
  async recordClick(@Param('variantId') variantId: string) {
    await this.abTestingService.recordClick(variantId);
    return { success: true };
  }

  @Post('variants/:variantId/conversion')
  async recordConversion(
    @Param('variantId') variantId: string,
    @Body() body: { revenue?: number },
  ) {
    await this.abTestingService.recordConversion(variantId, body.revenue);
    return { success: true };
  }
}
