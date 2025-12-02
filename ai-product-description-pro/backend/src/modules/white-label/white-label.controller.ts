import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WhiteLabelService, WhiteLabelConfigDto } from './white-label.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('white-label')
@UseGuards(JwtAuthGuard)
export class WhiteLabelController {
  constructor(private readonly whiteLabelService: WhiteLabelService) {}

  @Get()
  async getConfig(@Request() req: { user: { organizationId: string } }) {
    return this.whiteLabelService.getConfig(req.user.organizationId);
  }

  @Post()
  async upsertConfig(
    @Request() req: { user: { organizationId: string } },
    @Body() dto: WhiteLabelConfigDto,
  ) {
    return this.whiteLabelService.upsertConfig(req.user.organizationId, dto);
  }

  @Put('activate')
  async activateWhiteLabel(
    @Request() req: { user: { organizationId: string } },
  ) {
    return this.whiteLabelService.activateWhiteLabel(req.user.organizationId);
  }

  @Put('deactivate')
  async deactivateWhiteLabel(
    @Request() req: { user: { organizationId: string } },
  ) {
    return this.whiteLabelService.deactivateWhiteLabel(req.user.organizationId);
  }

  @Get('theme')
  async getTheme(
    @Query('domain') domain?: string,
    @Query('organizationId') organizationId?: string,
  ) {
    return this.whiteLabelService.getTheme({ domain, organizationId });
  }

  @Post('validate-domain')
  async validateDomain(@Body() body: { domain: string }) {
    return this.whiteLabelService.validateDomain(body.domain);
  }

  @Post('preview')
  async generatePreview(@Body() dto: WhiteLabelConfigDto) {
    return this.whiteLabelService.generatePreview(dto);
  }
}
