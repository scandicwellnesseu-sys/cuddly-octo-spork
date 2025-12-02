import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface ConnectZalandoDto {
  merchantId: string;
  clientId: string;
  clientSecret: string;
  salesChannels: string[];
}

export interface ZalandoProduct {
  ean: string;
  merchantSku: string;
  title: string;
  description?: string;
  brand: string;
  price?: number;
  images?: string[];
  salesChannel: string;
}

@Injectable()
export class ZalandoService {
  private readonly logger = new Logger(ZalandoService.name);

  // Zalando sales channels (marknader)
  private readonly salesChannels = [
    { code: 'DE', name: 'Tyskland' },
    { code: 'AT', name: 'Österrike' },
    { code: 'CH', name: 'Schweiz' },
    { code: 'NL', name: 'Nederländerna' },
    { code: 'BE', name: 'Belgien' },
    { code: 'FR', name: 'Frankrike' },
    { code: 'IT', name: 'Italien' },
    { code: 'ES', name: 'Spanien' },
    { code: 'PL', name: 'Polen' },
    { code: 'SE', name: 'Sverige' },
    { code: 'NO', name: 'Norge' },
    { code: 'DK', name: 'Danmark' },
    { code: 'FI', name: 'Finland' },
  ];

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Anslut Zalando Partner-konto
   */
  async connectStore(dto: ConnectZalandoDto, organizationId: string) {
    this.logger.log(`Ansluter Zalando-konto: ${dto.merchantId}`);

    // Validera sales channels
    const validChannels = this.salesChannels.map((c) => c.code);
    for (const channel of dto.salesChannels) {
      if (!validChannels.includes(channel)) {
        throw new Error(`Ogiltig sales channel: ${channel}`);
      }
    }

    // Skapa butik i databasen
    const store = await this.prisma.zalandoStore.create({
      data: {
        organizationId,
        merchantId: dto.merchantId,
        clientId: dto.clientId,
        clientSecret: dto.clientSecret,
        salesChannels: dto.salesChannels,
        isActive: true,
      },
    });

    // Verifiera anslutning
    try {
      await this.verifyConnection(store.id);
    } catch (error) {
      await this.prisma.zalandoStore.update({
        where: { id: store.id },
        data: { isActive: false },
      });
      throw new Error('Kunde inte verifiera Zalando-anslutning');
    }

    return store;
  }

  /**
   * Hämta anslutna Zalando-butiker
   */
  async getStores(organizationId: string) {
    return this.prisma.zalandoStore.findMany({
      where: { organizationId },
    });
  }

  /**
   * Koppla bort Zalando-butik
   */
  async disconnectStore(storeId: string) {
    await this.prisma.zalandoStore.delete({
      where: { id: storeId },
    });
    return { success: true };
  }

  /**
   * Hämta produkter från Zalando
   */
  async getProducts(
    storeId: string,
    options?: {
      salesChannel?: string;
      limit?: number;
      cursor?: string;
    },
  ): Promise<{
    products: ZalandoProduct[];
    nextCursor?: string;
  }> {
    const store = await this.prisma.zalandoStore.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Zalando-butik hittades inte');
    }

    // I produktion: använd Zalando Partner API
    // GET /merchants/{merchantId}/product-feeds
    this.logger.log(`Hämtar produkter för merchant: ${store.merchantId}`);

    // Simulerad data för demo
    return {
      products: [
        {
          ean: '4012345678901',
          merchantSku: 'SKU-001',
          title: 'Stilren klänning',
          description: 'En vacker klänning i skandinavisk design',
          brand: 'Nordic Fashion',
          price: 799,
          images: ['https://mosaic01.ztat.net/example.jpg'],
          salesChannel: options?.salesChannel || 'SE',
        },
      ],
      nextCursor: undefined,
    };
  }

  /**
   * Uppdatera produkt på Zalando
   */
  async updateProduct(
    storeId: string,
    ean: string,
    data: {
      title?: string;
      description?: string;
      salesChannel: string;
    },
  ) {
    const store = await this.prisma.zalandoStore.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Zalando-butik hittades inte');
    }

    // Kontrollera att sales channel är aktiverad
    if (!store.salesChannels.includes(data.salesChannel)) {
      throw new Error(`Sales channel ${data.salesChannel} är inte aktiverad`);
    }

    // I produktion: använd Zalando Partner API
    // PUT /merchants/{merchantId}/articles/{sku}/media
    this.logger.log(`Uppdaterar produkt ${ean} på Zalando ${data.salesChannel}`);

    return {
      success: true,
      ean,
      salesChannel: data.salesChannel,
      message: 'Produktuppdatering skickad till Zalando',
      note: 'Zalando granskar innehåll innan publicering (24-48 timmar)',
    };
  }

  /**
   * Synka produktdata från AI-generering till Zalando
   */
  async syncFromGeneration(
    storeId: string,
    generationId: string,
    ean: string,
    salesChannel: string,
  ) {
    const generation = await this.prisma.generation.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      throw new Error('Generering hittades inte');
    }

    return this.updateProduct(storeId, ean, {
      title: generation.metaTitle || undefined,
      description: generation.description || undefined,
      salesChannel,
    });
  }

  /**
   * Verifiera Zalando-anslutning
   */
  private async verifyConnection(storeId: string): Promise<boolean> {
    const store = await this.prisma.zalandoStore.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Butik hittades inte');
    }

    // I produktion: anropa Zalando Partner API
    // GET /merchants/{merchantId}
    this.logger.log(`Verifierar Zalando-anslutning för: ${store.merchantId}`);

    return true;
  }

  /**
   * Hämta tillgängliga sales channels
   */
  getAvailableSalesChannels() {
    return this.salesChannels;
  }

  /**
   * Översätt produkttext för specifik marknad
   */
  async translateForMarket(
    generationId: string,
    targetMarket: string,
  ): Promise<{
    title: string;
    description: string;
  }> {
    const generation = await this.prisma.generation.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      throw new Error('Generering hittades inte');
    }

    // Mapning av marknader till språk
    const marketLanguage: Record<string, string> = {
      DE: 'DE',
      AT: 'DE',
      CH: 'DE',
      FR: 'EN', // Förenkla - i produktion använd franska
      IT: 'EN',
      ES: 'EN',
      SE: 'SV',
      NO: 'NO',
      DK: 'DA',
      FI: 'FI',
    };

    const targetLanguage = marketLanguage[targetMarket] || 'EN';

    if (targetLanguage === generation.language) {
      return {
        title: generation.metaTitle || '',
        description: generation.description || '',
      };
    }

    // I produktion: använd översättningstjänst
    this.logger.log(`Översätter till ${targetLanguage} för marknad ${targetMarket}`);

    return {
      title: generation.metaTitle || '',
      description: generation.description || '',
    };
  }

  /**
   * Uppdatera synkstatus
   */
  async updateSyncStatus(storeId: string) {
    return this.prisma.zalandoStore.update({
      where: { id: storeId },
      data: { lastSyncAt: new Date() },
    });
  }

  /**
   * Hämta Zalando-specifika produktkrav
   */
  getProductRequirements(salesChannel: string) {
    return {
      requiredFields: [
        'ean',
        'title',
        'description',
        'brand',
        'price',
        'images',
        'size',
        'color',
      ],
      titleLength: { min: 10, max: 100 },
      descriptionLength: { min: 50, max: 2000 },
      imageRequirements: {
        minCount: 3,
        maxCount: 12,
        minResolution: '1024x1024',
        formats: ['jpg', 'png'],
      },
      categories: [
        'Kläder',
        'Skor',
        'Accessoarer',
        'Sport',
        'Beauty',
      ],
    };
  }
}
