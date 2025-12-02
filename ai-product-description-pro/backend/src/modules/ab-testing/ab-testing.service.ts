import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AbTestStatus } from '@prisma/client';

export interface CreateAbTestDto {
  name: string;
  description?: string;
  goalType: string;
  variants: {
    name: string;
    content: Record<string, unknown>;
    isControl?: boolean;
  }[];
}

export interface AbTestResult {
  testId: string;
  winnerId?: string;
  confidence: number;
  improvement: number;
  recommendations: string[];
}

@Injectable()
export class AbTestingService {
  private readonly logger = new Logger(AbTestingService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Skapa nytt A/B-test
   */
  async createTest(
    organizationId: string,
    dto: CreateAbTestDto,
  ) {
    this.logger.log(`Skapar A/B-test: ${dto.name}`);

    const test = await this.prisma.abTest.create({
      data: {
        organizationId,
        name: dto.name,
        description: dto.description,
        goalType: dto.goalType,
        variants: {
          create: dto.variants.map((v, index) => ({
            name: v.name || String.fromCharCode(65 + index), // A, B, C...
            content: v.content,
            isControl: v.isControl || index === 0,
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    return test;
  }

  /**
   * Starta A/B-test
   */
  async startTest(testId: string) {
    const test = await this.prisma.abTest.update({
      where: { id: testId },
      data: {
        status: AbTestStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    this.logger.log(`A/B-test startat: ${test.name}`);
    return test;
  }

  /**
   * Pausa A/B-test
   */
  async pauseTest(testId: string) {
    return this.prisma.abTest.update({
      where: { id: testId },
      data: { status: AbTestStatus.PAUSED },
    });
  }

  /**
   * Avsluta A/B-test och analysera resultat
   */
  async completeTest(testId: string): Promise<AbTestResult> {
    const test = await this.prisma.abTest.findUnique({
      where: { id: testId },
      include: { variants: true },
    });

    if (!test) {
      throw new NotFoundException('Test hittades inte');
    }

    // Beräkna statistisk signifikans
    const control = test.variants.find((v) => v.isControl);
    const variants = test.variants.filter((v) => !v.isControl);

    if (!control) {
      throw new Error('Ingen kontrollvariant hittad');
    }

    const controlRate = control.impressions > 0 
      ? control.conversions / control.impressions 
      : 0;

    let winner = control;
    let maxImprovement = 0;

    for (const variant of variants) {
      const variantRate = variant.impressions > 0 
        ? variant.conversions / variant.impressions 
        : 0;
      const improvement = ((variantRate - controlRate) / controlRate) * 100;

      if (improvement > maxImprovement && this.isStatisticallySignificant(control, variant)) {
        winner = variant;
        maxImprovement = improvement;
      }
    }

    // Uppdatera vinnare
    await this.prisma.abTestVariant.update({
      where: { id: winner.id },
      data: { isWinner: true },
    });

    await this.prisma.abTest.update({
      where: { id: testId },
      data: {
        status: AbTestStatus.COMPLETED,
        endedAt: new Date(),
      },
    });

    const confidence = this.calculateConfidence(control, winner);

    return {
      testId,
      winnerId: winner.id,
      confidence,
      improvement: maxImprovement,
      recommendations: this.generateRecommendations(maxImprovement, confidence),
    };
  }

  /**
   * Registrera impression
   */
  async recordImpression(variantId: string) {
    await this.prisma.abTestVariant.update({
      where: { id: variantId },
      data: { impressions: { increment: 1 } },
    });
  }

  /**
   * Registrera klick
   */
  async recordClick(variantId: string) {
    await this.prisma.abTestVariant.update({
      where: { id: variantId },
      data: { clicks: { increment: 1 } },
    });
  }

  /**
   * Registrera konvertering
   */
  async recordConversion(variantId: string, revenue?: number) {
    await this.prisma.abTestVariant.update({
      where: { id: variantId },
      data: {
        conversions: { increment: 1 },
        revenue: revenue ? { increment: revenue } : undefined,
      },
    });
  }

  /**
   * Hämta variant för visning (random split)
   */
  async getVariantForDisplay(testId: string): Promise<string> {
    const test = await this.prisma.abTest.findUnique({
      where: { id: testId },
      include: { variants: true },
    });

    if (!test || test.status !== AbTestStatus.RUNNING) {
      throw new NotFoundException('Aktivt test hittades inte');
    }

    // Enkel random split
    const randomIndex = Math.floor(Math.random() * test.variants.length);
    return test.variants[randomIndex].id;
  }

  /**
   * Hämta alla tester för organisation
   */
  async getTests(organizationId: string) {
    return this.prisma.abTest.findMany({
      where: { organizationId },
      include: {
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Kontrollera statistisk signifikans (Z-test)
   */
  private isStatisticallySignificant(
    control: { impressions: number; conversions: number },
    variant: { impressions: number; conversions: number },
  ): boolean {
    const p1 = control.conversions / control.impressions;
    const p2 = variant.conversions / variant.impressions;
    const n1 = control.impressions;
    const n2 = variant.impressions;

    if (n1 < 100 || n2 < 100) return false; // Minst 100 impressions

    const pooledP = (control.conversions + variant.conversions) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));
    const z = Math.abs(p2 - p1) / se;

    return z > 1.96; // 95% konfidensintervall
  }

  /**
   * Beräkna konfidensgrad
   */
  private calculateConfidence(
    control: { impressions: number; conversions: number },
    variant: { impressions: number; conversions: number },
  ): number {
    const p1 = control.conversions / control.impressions;
    const p2 = variant.conversions / variant.impressions;
    const n1 = control.impressions;
    const n2 = variant.impressions;

    const pooledP = (control.conversions + variant.conversions) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));
    const z = Math.abs(p2 - p1) / se;

    // Konvertera Z-score till konfidensgrad
    const confidence = (1 - 2 * (1 - this.normalCDF(z))) * 100;
    return Math.min(99.9, Math.max(0, confidence));
  }

  private normalCDF(z: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

    return 0.5 * (1.0 + sign * y);
  }

  private generateRecommendations(improvement: number, confidence: number): string[] {
    const recommendations: string[] = [];

    if (confidence < 95) {
      recommendations.push('Samla mer data för att uppnå statistisk signifikans (95%)');
    }

    if (improvement > 10) {
      recommendations.push('Vinnarens text bör användas för alla produkter');
    } else if (improvement > 5) {
      recommendations.push('Överväg att implementera vinnarens text');
    } else {
      recommendations.push('Skillnaden är minimal - testa nya varianter');
    }

    if (improvement > 20) {
      recommendations.push('Analysera vad som gör vinnartexten framgångsrik');
    }

    return recommendations;
  }
}
