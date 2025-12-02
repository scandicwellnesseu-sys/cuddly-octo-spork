import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WebhooksService, CreateWebhookDto } from './webhooks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('webhooks')
@UseGuards(JwtAuthGuard)
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  async createWebhook(
    @Request() req: { user: { organizationId: string } },
    @Body() dto: CreateWebhookDto,
  ) {
    return this.webhooksService.createWebhook(dto, req.user.organizationId);
  }

  @Get()
  async getWebhooks(@Request() req: { user: { organizationId: string } }) {
    return this.webhooksService.getWebhooks(req.user.organizationId);
  }

  @Get('events')
  async getAvailableEvents() {
    return this.webhooksService.getAvailableEvents();
  }

  @Put(':id')
  async updateWebhook(
    @Param('id') id: string,
    @Body() body: Partial<CreateWebhookDto> & { isActive?: boolean },
  ) {
    return this.webhooksService.updateWebhook(id, body);
  }

  @Delete(':id')
  async deleteWebhook(@Param('id') id: string) {
    return this.webhooksService.deleteWebhook(id);
  }

  @Post(':id/test')
  async testWebhook(@Param('id') id: string) {
    return this.webhooksService.testWebhook(id);
  }

  @Get(':id/deliveries')
  async getDeliveryHistory(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.webhooksService.getDeliveryHistory(
      id,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Post('deliveries/:id/retry')
  async retryDelivery(@Param('id') id: string) {
    return this.webhooksService.retryDelivery(id);
  }
}
