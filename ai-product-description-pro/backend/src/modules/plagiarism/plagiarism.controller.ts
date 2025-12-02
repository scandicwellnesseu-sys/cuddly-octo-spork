import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PlagiarismService } from './plagiarism.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('plagiarism')
@UseGuards(JwtAuthGuard)
export class PlagiarismController {
  constructor(private readonly plagiarismService: PlagiarismService) {}

  @Post('check')
  async checkPlagiarism(
    @Request() req: { user: { organizationId: string } },
    @Body() body: { content: string; generationId?: string },
  ) {
    return this.plagiarismService.checkPlagiarism(
      body.content,
      req.user.organizationId,
      body.generationId,
    );
  }

  @Get('history')
  async getCheckHistory(
    @Request() req: { user: { organizationId: string } },
    @Query('limit') limit?: string,
  ) {
    return this.plagiarismService.getChecks(
      req.user.organizationId,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Post('compare')
  async compareTexts(@Body() body: { text1: string; text2: string }) {
    return this.plagiarismService.compareTexts(body.text1, body.text2);
  }
}
