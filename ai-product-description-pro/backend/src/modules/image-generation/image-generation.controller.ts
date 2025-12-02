import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ImageGenerationService, GenerateImageDto } from './image-generation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('image-generation')
@UseGuards(JwtAuthGuard)
export class ImageGenerationController {
  constructor(private readonly imageGenerationService: ImageGenerationService) {}

  @Post()
  async generateImage(
    @Request() req: { user: { id: string; organizationId: string } },
    @Body() dto: GenerateImageDto,
  ) {
    return this.imageGenerationService.generateImage(
      dto,
      req.user.id,
      req.user.organizationId,
    );
  }

  @Post('from-description')
  async generateFromDescription(
    @Request() req: { user: { id: string; organizationId: string } },
    @Body() body: { description: string; style?: string },
  ) {
    return this.imageGenerationService.generateFromDescription(
      body.description,
      req.user.id,
      req.user.organizationId,
      body.style,
    );
  }

  @Get()
  async getGeneratedImages(
    @Request() req: { user: { organizationId: string } },
    @Query('limit') limit?: string,
  ) {
    return this.imageGenerationService.getGeneratedImages(
      req.user.organizationId,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Post(':id/variants')
  async generateVariants(
    @Param('id') id: string,
    @Request() req: { user: { id: string; organizationId: string } },
    @Body() body: { count?: number },
  ) {
    return this.imageGenerationService.generateVariants(
      id,
      body.count || 3,
      req.user.id,
      req.user.organizationId,
    );
  }
}
