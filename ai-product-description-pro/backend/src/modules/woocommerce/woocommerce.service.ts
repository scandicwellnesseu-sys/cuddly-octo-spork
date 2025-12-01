import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface WooProduct {
  id: number;
  name: string;
  description: string;
  short_description: string;
  images: { src: string }[];
  price: string;
  categories: { name: string }[];
}

@Injectable()
export class WoocommerceService {
  private readonly logger = new Logger(WoocommerceService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Koppla WooCommerce-butik
   */
  async connectStore(
    organizationId: string,
    storeUrl: string,
    consumerKey: string,
    consumerSecret: string,
  ) {
    // Verifiera anslutning
    const isValid = await this.verifyConnection(storeUrl, consumerKey, consumerSecret);
    if (!isValid) {
      throw new BadRequestException('Kunde inte ansluta till WooCommerce-butiken');
    }

    return this.prisma.wooCommerceStore.create({
      data: {
        organizationId,
        storeUrl,
        consumerKey,
        consumerSecret,
      },
    });
  }

  /**
   * Verifiera WooCommerce-anslutning
   */
  private async verifyConnection(
    storeUrl: string,
    consumerKey: string,
    consumerSecret: string,
  ): Promise<boolean> {
    try {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const response = await fetch(`${storeUrl}/wp-json/wc/v3/system_status`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Hämta produkter från WooCommerce
   */
  async getProducts(storeId: string, page = 1, limit = 50): Promise<WooProduct[]> {
    const store = await this.prisma.wooCommerceStore.findUnique({ where: { id: storeId } });
    if (!store) {
      throw new BadRequestException('Butik inte hittad');
    }

    const auth = Buffer.from(`${store.consumerKey}:${store.consumerSecret}`).toString('base64');
    const response = await fetch(
      `${store.storeUrl}/wp-json/wc/v3/products?page=${page}&per_page=${limit}`,
      {
        headers: { Authorization: `Basic ${auth}` },
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Kunde inte hämta produkter från WooCommerce');
    }

    return response.json();
  }

  /**
   * Uppdatera produkt i WooCommerce
   */
  async updateProduct(
    storeId: string,
    productId: number,
    updates: {
      name?: string;
      description?: string;
      short_description?: string;
      meta_data?: { key: string; value: string }[];
    },
  ): Promise<WooProduct> {
    const store = await this.prisma.wooCommerceStore.findUnique({ where: { id: storeId } });
    if (!store) {
      throw new BadRequestException('Butik inte hittad');
    }

    const auth = Buffer.from(`${store.consumerKey}:${store.consumerSecret}`).toString('base64');
    const response = await fetch(`${store.storeUrl}/wp-json/wc/v3/products/${productId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new BadRequestException('Kunde inte uppdatera produkt i WooCommerce');
    }

    return response.json();
  }

  /**
   * Synka genererad text till WooCommerce-produkt
   */
  async syncToProduct(
    storeId: string,
    productId: number,
    generatedContent: {
      description: string;
      shortDescription: string;
      metaTitle: string;
      metaDescription: string;
    },
  ) {
    return this.updateProduct(storeId, productId, {
      description: generatedContent.description,
      short_description: generatedContent.shortDescription,
      meta_data: [
        { key: '_yoast_wpseo_title', value: generatedContent.metaTitle },
        { key: '_yoast_wpseo_metadesc', value: generatedContent.metaDescription },
      ],
    });
  }

  /**
   * Hämta kopplade butiker
   */
  async getStores(organizationId: string) {
    return this.prisma.wooCommerceStore.findMany({
      where: { organizationId },
      select: {
        id: true,
        storeUrl: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
      },
    });
  }

  /**
   * Koppla bort butik
   */
  async disconnectStore(storeId: string, organizationId: string) {
    return this.prisma.wooCommerceStore.delete({
      where: { id: storeId, organizationId },
    });
  }
}
