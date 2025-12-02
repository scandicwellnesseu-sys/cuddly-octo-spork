import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  organizationId: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    organizationId: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: { organization: true },
          take: 1,
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Ogiltiga inloggningsuppgifter');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Ogiltiga inloggningsuppgifter');
    }

    const membership = user.memberships[0];
    if (!membership) {
      throw new UnauthorizedException('Användaren saknar organisation');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      organizationId: membership.organizationId,
      role: membership.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: membership.organizationId,
        role: membership.role,
      },
    };
  }

  async register(
    email: string,
    password: string,
    name?: string,
    organizationName?: string,
  ): Promise<AuthResponse> {
    // Kontrollera om användaren redan finns
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('E-postadressen är redan registrerad');
    }

    // Hasha lösenord
    const passwordHash = await bcrypt.hash(password, 10);

    // Skapa organisation
    const orgSlug = (organizationName || email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const organization = await this.prisma.organization.create({
      data: {
        name: organizationName || `${name || email.split('@')[0]}s Organisation`,
        slug: `${orgSlug}-${Date.now().toString(36)}`,
        creditsBalance: 10, // 10 gratis startcredits
      },
    });

    // Skapa användare
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        memberships: {
          create: {
            organizationId: organization.id,
            role: 'OWNER',
          },
        },
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      organizationId: organization.id,
      role: 'OWNER',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: organization.id,
        role: 'OWNER',
      },
    };
  }

  async refreshToken(userId: string): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: { take: 1 },
      },
    });

    if (!user || !user.memberships[0]) {
      throw new UnauthorizedException('Användare hittades inte');
    }

    const membership = user.memberships[0];
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      organizationId: membership.organizationId,
      role: membership.role,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Ogiltig token');
    }
  }
}
