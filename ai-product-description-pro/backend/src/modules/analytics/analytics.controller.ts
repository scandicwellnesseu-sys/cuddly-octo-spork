import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: { sub: string; organizationId: string };
}

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Hämta dashboard-statistik' })
  async getDashboard(@Req() req: AuthenticatedRequest) {
    return this.analyticsService.getDashboardStats(req.user.organizationId);
  }

  @Get('events')
  @ApiOperation({ summary: 'Hämta händelselogg' })
  async getEvents(
    @Req() req: AuthenticatedRequest,
    @Query('eventType') eventType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getEvents(
      req.user.organizationId,
      eventType,
      limit ? parseInt(limit, 10) : 100,
    );
  }

  @Get('users')
  @ApiOperation({ summary: 'Hämta användningsstatistik per användare' })
  async getUserStats(@Req() req: AuthenticatedRequest) {
    return this.analyticsService.getUserStats(req.user.organizationId);
  }
}
