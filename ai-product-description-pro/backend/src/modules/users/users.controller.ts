import { Controller, Get, Put, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: { sub: string };
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Hämta användarprofil' })
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Uppdatera användarprofil' })
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: { name?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(req.user.sub, body);
  }

  @Get('generations')
  @ApiOperation({ summary: 'Hämta generingshistorik' })
  async getGenerations(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.getGenerationHistory(
      req.user.sub,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
