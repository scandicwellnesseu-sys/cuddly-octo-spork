import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { PublishPlatform, PublishStatus } from '@prisma/client';
import { ShopifyService } from '../shopify/shopify.service';
import { WoocommerceService } from '../woocommerce/woocommerce.service';

export interface SchedulePublishDto {
  generationId: string;
  platform: PublishPlatform;
  storeId?: string;
  productId?: string;
  scheduledFor: Date;
}

@Injectable()
export class ScheduledPublishingService {
  private readonly logger = new Logger(ScheduledPublishingService.name);

  constructor(
    private prisma: PrismaService,
    private shopifyService: ShopifyService,
    private woocommerceService: WoocommerceService,
  ) {}

  /**
   * Schemalägg publicering
   */
  async schedulePublish(
    dto: SchedulePublishDto,
    organizationId: string,
  ) {
    this.logger.log(`Schemalägger publicering för ${dto.generationId}`);

    // Validera att genereringen finns
    const generation = await this.prisma.generation.findUnique({
      where: { id: dto.generationId },
    });

    if (!generation) {
      throw new Error('Generering hittades inte');
    }

    // Skapa schemaläggning
    const scheduled = await this.prisma.scheduledPublish.create({
      data: {
        organizationId,
        generationId: dto.generationId,
        platform: dto.platform,
        storeId: dto.storeId,
        productId: dto.productId,
        scheduledFor: new Date(dto.scheduledFor),
        status: PublishStatus.SCHEDULED,
      },
    });

    return scheduled;
  }

  /**
   * Hämta schemalagda publiceringar
   */
  async getScheduledPublishes(organizationId: string) {
    return this.prisma.scheduledPublish.findMany({
      where: { organizationId },
      orderBy: { scheduledFor: 'asc' },
      include: {
        organization: {
          select: { name: true },
        },
      },
    });
  }

  /**
   * Avbryt schemaläggning
   */
  async cancelScheduledPublish(id: string) {
    return this.prisma.scheduledPublish.update({
      where: { id },
      data: { status: PublishStatus.CANCELLED },
    });
  }

  /**
   * Uppdatera schemaläggning
   */
  async updateScheduledPublish(
    id: string,
    data: { scheduledFor?: Date; productId?: string },
  ) {
    return this.prisma.scheduledPublish.update({
      where: { id },
      data: {
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined,
        productId: data.productId,
      },
    });
  }

  /**
   * Kör schemalagda publiceringar (körs varje minut)
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async processScheduledPublishes() {
    const now = new Date();

    // Hämta alla som ska publiceras nu
    const pending = await this.prisma.scheduledPublish.findMany({
      where: {
        status: PublishStatus.SCHEDULED,
        scheduledFor: { lte: now },
      },
      include: {
        organization: {
          include: {
            shopifyStores: true,
            wooStores: true,
          },
        },
      },
    });

    for (const scheduled of pending) {
      try {
        // Markera som pågående
        await this.prisma.scheduledPublish.update({
          where: { id: scheduled.id },
          data: { status: PublishStatus.PUBLISHING },
        });

        // Hämta genereringsdata
        const generation = await this.prisma.generation.findUnique({
          where: { id: scheduled.generationId },
        });

        if (!generation) {
          throw new Error('Generering hittades inte');
        }

        // Publicera baserat på plattform
        await this.publishToPlatform(scheduled, generation);

        // Markera som klar
        await this.prisma.scheduledPublish.update({
          where: { id: scheduled.id },
          data: {
            status: PublishStatus.PUBLISHED,
            publishedAt: new Date(),
          },
        });

        this.logger.log(`Publicerade ${scheduled.generationId} till ${scheduled.platform}`);
      } catch (error) {
        // Hantera fel
        const retryCount = scheduled.retryCount + 1;
        const shouldRetry = retryCount < 3;

        await this.prisma.scheduledPublish.update({
          where: { id: scheduled.id },
          data: {
            status: shouldRetry ? PublishStatus.SCHEDULED : PublishStatus.FAILED,
            errorMessage: error instanceof Error ? error.message : 'Okänt fel',
            retryCount,
            scheduledFor: shouldRetry
              ? new Date(Date.now() + retryCount * 5 * 60 * 1000) // Öka väntetid
              : undefined,
          },
        });

        this.logger.error(
          `Publicering misslyckades för ${scheduled.id}: ${error}`,
        );
      }
    }
  }

  /**
   * Publicera till specifik plattform
   */
  private async publishToPlatform(
    scheduled: {
      platform: PublishPlatform;
      storeId: string | null;
      productId: string | null;
      organization: {
        shopifyStores: { id: string; shopDomain: string }[];
        wooStores: { id: string; storeUrl: string }[];
      };
    },
    generation: {
      description: string | null;
      shortDescription: string | null;
      metaTitle: string | null;
      metaDescription: string | null;
      altTexts: string[];
    },
  ) {
    const productData = {
      description: generation.description || '',
      shortDescription: generation.shortDescription || '',
      metaTitle: generation.metaTitle || '',
      metaDescription: generation.metaDescription || '',
      altTexts: generation.altTexts,
    };

    switch (scheduled.platform) {
      case 'SHOPIFY':
        await this.publishToShopify(scheduled, productData);
        break;
      case 'WOOCOMMERCE':
        await this.publishToWooCommerce(scheduled, productData);
        break;
      case 'AMAZON':
        await this.publishToAmazon(scheduled, productData);
        break;
      case 'ZALANDO':
        await this.publishToZalando(scheduled, productData);
        break;
      default:
        throw new Error(`Okänd plattform: ${scheduled.platform}`);
    }
  }

  /**
   * Publicera till Shopify
   */
  private async publishToShopify(
    scheduled: {
      storeId: string | null;
      productId: string | null;
      organization: { shopifyStores: { id: string; shopDomain: string }[] };
    },
    productData: {
      description: string;
      metaTitle: string;
      metaDescription: string;
    },
  ) {
    const store = scheduled.storeId
      ? scheduled.organization.shopifyStores.find((s) => s.id === scheduled.storeId)
      : scheduled.organization.shopifyStores[0];

    if (!store) {
      throw new Error('Ingen Shopify-butik hittad');
    }

    if (!scheduled.productId) {
      throw new Error('Produkt-ID krävs för Shopify');
    }

    // Använd Shopify-service för att uppdatera produkt
    await this.shopifyService.updateProduct(
      store.shopDomain,
      scheduled.productId,
      productData,
    );
  }

  /**
   * Publicera till WooCommerce
   */
  private async publishToWooCommerce(
    scheduled: {
      storeId: string | null;
      productId: string | null;
      organization: { wooStores: { id: string; storeUrl: string }[] };
    },
    productData: {
      description: string;
      shortDescription: string;
    },
  ) {
    const store = scheduled.storeId
      ? scheduled.organization.wooStores.find((s) => s.id === scheduled.storeId)
      : scheduled.organization.wooStores[0];

    if (!store) {
      throw new Error('Ingen WooCommerce-butik hittad');
    }

    if (!scheduled.productId) {
      throw new Error('Produkt-ID krävs för WooCommerce');
    }

    // Använd WooCommerce-service för att uppdatera produkt
    await this.woocommerceService.updateProduct(
      store.storeUrl,
      scheduled.productId,
      productData,
    );
  }

  /**
   * Publicera till Amazon (placeholder)
   */
  private async publishToAmazon(
    scheduled: { productId: string | null },
    productData: { description: string },
  ) {
    // TODO: Implementera Amazon SP-API integration
    this.logger.log(`Skulle publicera till Amazon: ${scheduled.productId}`);
    throw new Error('Amazon-integration ej konfigurerad');
  }

  /**
   * Publicera till Zalando (placeholder)
   */
  private async publishToZalando(
    scheduled: { productId: string | null },
    productData: { description: string },
  ) {
    // TODO: Implementera Zalando Partner API integration
    this.logger.log(`Skulle publicera till Zalando: ${scheduled.productId}`);
    throw new Error('Zalando-integration ej konfigurerad');
  }

  /**
   * Hämta publiceringshistorik
   */
  async getPublishHistory(organizationId: string, limit = 50) {
    return this.prisma.scheduledPublish.findMany({
      where: {
        organizationId,
        status: {
          in: [PublishStatus.PUBLISHED, PublishStatus.FAILED],
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }
}
