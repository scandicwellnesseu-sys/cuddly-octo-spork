import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrgsService } from './orgs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrgRole } from '@prisma/client';

interface AuthenticatedRequest {
  user: { sub: string; organizationId: string };
}

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/organizations')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Get('current')
  @ApiOperation({ summary: 'Hämta aktuell organisation' })
  async getCurrent(@Req() req: AuthenticatedRequest) {
    return this.orgsService.getOrganization(req.user.organizationId);
  }

  @Put('current')
  @ApiOperation({ summary: 'Uppdatera organisation' })
  async updateCurrent(
    @Req() req: AuthenticatedRequest,
    @Body() body: { name?: string; logo?: string },
  ) {
    return this.orgsService.updateOrganization(req.user.organizationId, body);
  }

  @Get('members')
  @ApiOperation({ summary: 'Hämta organisationsmedlemmar' })
  async getMembers(@Req() req: AuthenticatedRequest) {
    return this.orgsService.getMembers(req.user.organizationId);
  }

  @Post('members/invite')
  @ApiOperation({ summary: 'Bjud in ny medlem' })
  async inviteMember(
    @Req() req: AuthenticatedRequest,
    @Body() body: { email: string; role: OrgRole },
  ) {
    return this.orgsService.inviteMember(
      req.user.organizationId,
      body.email,
      body.role,
      req.user.sub,
    );
  }

  @Put('members/:memberId/role')
  @ApiOperation({ summary: 'Uppdatera medlemsroll' })
  async updateMemberRole(
    @Req() req: AuthenticatedRequest,
    @Param('memberId') memberId: string,
    @Body() body: { role: OrgRole },
  ) {
    return this.orgsService.updateMemberRole(
      req.user.organizationId,
      memberId,
      body.role,
      req.user.sub,
    );
  }

  @Delete('members/:memberId')
  @ApiOperation({ summary: 'Ta bort medlem' })
  async removeMember(
    @Req() req: AuthenticatedRequest,
    @Param('memberId') memberId: string,
  ) {
    return this.orgsService.removeMember(req.user.organizationId, memberId, req.user.sub);
  }

  @Get('credits')
  @ApiOperation({ summary: 'Hämta kreditsaldo' })
  async getCredits(@Req() req: AuthenticatedRequest) {
    return this.orgsService.getCreditsBalance(req.user.organizationId);
  }
}
