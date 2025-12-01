import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: { organization: true },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateProfile(userId: string, data: { name?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getGenerationHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [generations, total] = await Promise.all([
      this.prisma.generation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.generation.count({ where: { userId } }),
    ]);

    return {
      generations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
