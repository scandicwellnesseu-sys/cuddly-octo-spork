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
import { ScheduledPublishingService, SchedulePublishDto } from './scheduled-publishing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scheduled-publishing')
@UseGuards(JwtAuthGuard)
export class ScheduledPublishingController {
  constructor(
    private readonly scheduledPublishingService: ScheduledPublishingService,
  ) {}

  @Post()
  async schedulePublish(
    @Request() req: { user: { organizationId: string } },
    @Body() dto: SchedulePublishDto,
  ) {
    return this.scheduledPublishingService.schedulePublish(
      dto,
      req.user.organizationId,
    );
  }

  @Get()
  async getScheduledPublishes(
    @Request() req: { user: { organizationId: string } },
  ) {
    return this.scheduledPublishingService.getScheduledPublishes(
      req.user.organizationId,
    );
  }

  @Put(':id')
  async updateScheduledPublish(
    @Param('id') id: string,
    @Body() body: { scheduledFor?: Date; productId?: string },
  ) {
    return this.scheduledPublishingService.updateScheduledPublish(id, body);
  }

  @Delete(':id')
  async cancelScheduledPublish(@Param('id') id: string) {
    return this.scheduledPublishingService.cancelScheduledPublish(id);
  }

  @Get('history')
  async getPublishHistory(
    @Request() req: { user: { organizationId: string } },
    @Query('limit') limit?: string,
  ) {
    return this.scheduledPublishingService.getPublishHistory(
      req.user.organizationId,
      limit ? parseInt(limit, 10) : 50,
    );
  }
}
