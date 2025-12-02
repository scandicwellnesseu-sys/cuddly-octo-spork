import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrgRole } from '@prisma/client';

@Injectable()
export class OrgsService {
  constructor(private prisma: PrismaService) {}

  async getOrganization(orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        members: {
          include: { user: true },
        },
        _count: {
          select: { generations: true },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organisation hittades inte');
    }

    return org;
  }

  async getMembers(orgId: string) {
    return this.prisma.orgMember.findMany({
      where: { organizationId: orgId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async inviteMember(orgId: string, email: string, role: OrgRole, invitedByUserId: string) {
    // Kontrollera att inbjudaren har rätt behörighet
    const inviter = await this.prisma.orgMember.findFirst({
      where: { organizationId: orgId, userId: invitedByUserId },
    });

    if (!inviter || inviter.role === 'VIEWER') {
      throw new ForbiddenException('Du har inte behörighet att bjuda in medlemmar');
    }

    // Hitta eller skapa användare
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({ data: { email } });
    }

    // Kontrollera om redan medlem
    const existingMember = await this.prisma.orgMember.findFirst({
      where: { organizationId: orgId, userId: user.id },
    });

    if (existingMember) {
      throw new ForbiddenException('Användaren är redan medlem i organisationen');
    }

    // Skapa medlemskap
    return this.prisma.orgMember.create({
      data: {
        organizationId: orgId,
        userId: user.id,
        role,
      },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  }

  async updateMemberRole(orgId: string, memberId: string, newRole: OrgRole, updatedByUserId: string) {
    const updater = await this.prisma.orgMember.findFirst({
      where: { organizationId: orgId, userId: updatedByUserId },
    });

    if (!updater || updater.role !== 'OWNER') {
      throw new ForbiddenException('Endast ägare kan ändra roller');
    }

    return this.prisma.orgMember.update({
      where: { id: memberId },
      data: { role: newRole },
    });
  }

  async removeMember(orgId: string, memberId: string, removedByUserId: string) {
    const remover = await this.prisma.orgMember.findFirst({
      where: { organizationId: orgId, userId: removedByUserId },
    });

    if (!remover || remover.role === 'VIEWER') {
      throw new ForbiddenException('Du har inte behörighet att ta bort medlemmar');
    }

    const memberToRemove = await this.prisma.orgMember.findUnique({
      where: { id: memberId },
    });

    if (memberToRemove?.role === 'OWNER') {
      throw new ForbiddenException('Kan inte ta bort organisationens ägare');
    }

    return this.prisma.orgMember.delete({ where: { id: memberId } });
  }

  async updateOrganization(orgId: string, data: { name?: string; logo?: string }) {
    return this.prisma.organization.update({
      where: { id: orgId },
      data,
    });
  }

  async getCreditsBalance(orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        creditsBalance: true,
        plan: true,
        creditsResetAt: true,
      },
    });

    return org;
  }
}
