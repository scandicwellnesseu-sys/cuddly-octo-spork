import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrandVoiceService } from './brand-voice.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: { sub: string; organizationId: string };
}

@ApiTags('brand-voice')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/brand-voice')
export class BrandVoiceController {
  constructor(private readonly brandVoiceService: BrandVoiceService) {}

  @Get()
  @ApiOperation({ summary: 'Lista alla Brand Voices' })
  async list(@Req() req: AuthenticatedRequest) {
    return this.brandVoiceService.listBrandVoices(req.user.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Hämta en Brand Voice' })
  async get(@Param('id') id: string) {
    return this.brandVoiceService.getBrandVoice(id);
  }

  @Post()
  @ApiOperation({ summary: 'Skapa ny Brand Voice från exempeltexter' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: {
      name: string;
      description?: string;
      exampleTexts: string[];
    },
  ) {
    return this.brandVoiceService.analyzeTexts(
      req.user.sub,
      req.user.organizationId,
      body.name,
      body.exampleTexts,
      body.description,
    );
  }

  @Post(':id/default')
  @ApiOperation({ summary: 'Sätt som standard Brand Voice' })
  async setDefault(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.brandVoiceService.setDefault(id, req.user.organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ta bort Brand Voice' })
  async delete(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.brandVoiceService.deleteBrandVoice(id, req.user.organizationId);
  }
}
