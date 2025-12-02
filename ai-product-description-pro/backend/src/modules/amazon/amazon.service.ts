import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface ConnectAmazonDto {
  sellerId: string;
  marketplaceId: string;
  region: 'EU' | 'NA' | 'FE';
  refreshToken: string;
}

export interface AmazonProduct {
  asin: string;
  title: string;
  description?: string;
  bulletPoints?: string[];
  price?: number;
  images?: string[];
}

@Injectable()
export class AmazonService {
  private readonly logger = new Logger(AmazonService.name);

  // Amazon marketplace IDs
  private readonly marketplaces = {
    EU: {
      DE: 'A1PA6795UKMFR9',
      SE: 'A2NODRKZP88ZB9',
      UK: 'A1F83G8C2ARO7P',
      FR: 'A13V1IB3VIYBER',
      IT: 'APJ6JRA9NG5V4',
      ES: 'A1RKKUPIHCS9HS',
      NL: 'A1805IZSGTT6HS',
      PL: 'A1C3SOZRARQ6R3',
    },
    NA: {
      US: 'ATVPDKIKX0DER',
      CA: 'A2EUQ1WTGCTBG2',
      MX: 'A1AM78C64UM0Y8',
    },
    FE: {
      JP: 'A1VC38T7YXB528',
      AU: 'A39IBJ37TRP1C6',
    },
  };

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Anslut Amazon-konto
   */
  async connectStore(dto: ConnectAmazonDto, organizationId: string) {
    this.logger.log(`Ansluter Amazon-konto: ${dto.sellerId}`);

    // Validera marketplace ID
    const validMarketplaces = Object.values(this.marketplaces[dto.region]).flat();
    if (!validMarketplaces.includes(dto.marketplaceId)) {
      throw new Error('Ogiltigt marketplace ID');
    }

    // Skapa butik i databasen
    const store = await this.prisma.amazonStore.create({
      data: {
        organizationId,
        sellerId: dto.sellerId,
        marketplaceId: dto.marketplaceId,
        region: dto.region,
        refreshToken: dto.refreshToken,
        isActive: true,
      },
    });

    // Försök verifiera anslutning
    try {
      await this.verifyConnection(store.id);
    } catch (error) {
      // Markera som inaktiv om verifiering misslyckas
      await this.prisma.amazonStore.update({
        where: { id: store.id },
        data: { isActive: false },
      });
      throw new Error('Kunde inte verifiera Amazon-anslutning');
    }

    return store;
  }

  /**
   * Hämta anslutna Amazon-butiker
   */
  async getStores(organizationId: string) {
    return this.prisma.amazonStore.findMany({
      where: { organizationId },
    });
  }

  /**
   * Koppla bort Amazon-butik
   */
  async disconnectStore(storeId: string) {
    await this.prisma.amazonStore.delete({
      where: { id: storeId },
    });
    return { success: true };
  }

  /**
   * Hämta produkter från Amazon
   */
  async getProducts(
    storeId: string,
    options?: { limit?: number; cursor?: string },
  ): Promise<{
    products: AmazonProduct[];
    nextCursor?: string;
  }> {
    const store = await this.prisma.amazonStore.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Amazon-butik hittades inte');
    }

    // Hämta access token
    const accessToken = await this.getAccessToken(store);

    // I produktion: använd Amazon SP-API
    // GET /catalog/2022-04-01/items
    this.logger.log(`Hämtar produkter för seller: ${store.sellerId}`);

    // Simulerad data för demo
    return {
      products: [
        {
          asin: 'B09EXAMPLE1',
          title: 'Exempelprodukt från Amazon',
          description: 'En fantastisk produkt tillgänglig på Amazon',
          bulletPoints: [
            'Hög kvalitet',
            'Snabb leverans med Prime',
            'Nöjd kund-garanti',
          ],
          price: 299,
          images: ['https://m.media-amazon.com/images/example.jpg'],
        },
      ],
      nextCursor: undefined,
    };
  }

  /**
   * Uppdatera produkt på Amazon
   */
  async updateProduct(
    storeId: string,
    asin: string,
    data: {
      title?: string;
      description?: string;
      bulletPoints?: string[];
    },
  ) {
    const store = await this.prisma.amazonStore.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Amazon-butik hittades inte');
    }

    const accessToken = await this.getAccessToken(store);

    // I produktion: använd Amazon SP-API
    // POST /listings/2021-08-01/items/{sellerId}/{sku}
    this.logger.log(`Uppdaterar produkt ${asin} på Amazon`);

    // Simulerad uppdatering
    return {
      success: true,
      asin,
      message: 'Produktuppdatering skickad till Amazon',
      note: 'Amazon granskar ändringar innan publicering (kan ta 15-30 minuter)',
    };
  }

  /**
   * Synka produktdata från AI-generering till Amazon
   */
  async syncFromGeneration(
    storeId: string,
    generationId: string,
    asin: string,
  ) {
    // Hämta genererad data
    const generation = await this.prisma.generation.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      throw new Error('Generering hittades inte');
    }

    // Formatera för Amazon (bullet points från beskrivning)
    const bulletPoints = this.extractBulletPoints(generation.description || '');

    return this.updateProduct(storeId, asin, {
      title: generation.metaTitle || undefined,
      description: generation.description || undefined,
      bulletPoints,
    });
  }

  /**
   * Hämta access token (refresh om nödvändigt)
   */
  private async getAccessToken(store: {
    id: string;
    refreshToken: string;
    accessToken: string | null;
    tokenExpiresAt: Date | null;
  }): Promise<string> {
    // Kontrollera om befintlig token är giltig
    if (
      store.accessToken &&
      store.tokenExpiresAt &&
      store.tokenExpiresAt > new Date()
    ) {
      return store.accessToken;
    }

    // Refresh token
    // I produktion: anropa Amazon LWA (Login with Amazon)
    const newAccessToken = 'simulated_access_token';
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 timme

    await this.prisma.amazonStore.update({
      where: { id: store.id },
      data: {
        accessToken: newAccessToken,
        tokenExpiresAt: expiresAt,
      },
    });

    return newAccessToken;
  }

  /**
   * Verifiera Amazon-anslutning
   */
  private async verifyConnection(storeId: string): Promise<boolean> {
    const store = await this.prisma.amazonStore.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Butik hittades inte');
    }

    // I produktion: anropa Amazon SP-API för att verifiera
    // GET /sellers/v1/marketplaceParticipations
    this.logger.log(`Verifierar Amazon-anslutning för: ${store.sellerId}`);

    return true;
  }

  /**
   * Extrahera bullet points från beskrivning
   */
  private extractBulletPoints(description: string): string[] {
    // Dela upp beskrivning i meningar
    const sentences = description
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10 && s.length < 200);

    // Ta max 5 bullet points
    return sentences.slice(0, 5);
  }

  /**
   * Hämta tillgängliga marknadsplatser
   */
  getAvailableMarketplaces() {
    return this.marketplaces;
  }

  /**
   * Uppdatera synkstatus
   */
  async updateSyncStatus(storeId: string) {
    return this.prisma.amazonStore.update({
      where: { id: storeId },
      data: { lastSyncAt: new Date() },
    });
  }
}
