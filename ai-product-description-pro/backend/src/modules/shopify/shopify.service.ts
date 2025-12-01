import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  images: { src: string }[];
  variants: { price: string }[];
}

@Injectable()
export class ShopifyService {
  private readonly logger = new Logger(ShopifyService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Starta OAuth-flöde för Shopify
   */
  getOAuthUrl(shopDomain: string, redirectUri: string): string {
    const apiKey = this.configService.get<string>('SHOPIFY_API_KEY');
    const scopes = 'read_products,write_products';

    return `https://${shopDomain}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  /**
   * Byt ut OAuth-kod mot access token
   */
  async exchangeToken(shopDomain: string, code: string, organizationId: string): Promise<string> {
    const apiKey = this.configService.get<string>('SHOPIFY_API_KEY');
    const apiSecret = this.configService.get<string>('SHOPIFY_API_SECRET');

    const response = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      }),
    });

    if (!response.ok) {
      throw new BadRequestException('Kunde inte hämta access token från Shopify');
    }

    const data = await response.json();
    const accessToken = data.access_token;

    // Spara i databasen
    await this.prisma.shopifyStore.upsert({
      where: { shopDomain },
      update: { accessToken, organizationId },
      create: {
        shopDomain,
        accessToken,
        organizationId,
        scope: ['read_products', 'write_products'],
      },
    });

    return accessToken;
  }

  /**
   * Hämta produkter från Shopify
   */
  async getProducts(shopDomain: string, limit = 50): Promise<ShopifyProduct[]> {
    const store = await this.prisma.shopifyStore.findUnique({ where: { shopDomain } });
    if (!store) {
      throw new BadRequestException('Butik inte kopplad');
    }

    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-01/products.json?limit=${limit}`,
      {
        headers: {
          'X-Shopify-Access-Token': store.accessToken,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Kunde inte hämta produkter från Shopify');
    }

    const data = await response.json();
    return data.products;
  }

  /**
   * Uppdatera produkt i Shopify
   */
  async updateProduct(
    shopDomain: string,
    productId: string,
    updates: {
      title?: string;
      body_html?: string;
      metafields_global_title_tag?: string;
      metafields_global_description_tag?: string;
    },
  ): Promise<ShopifyProduct> {
    const store = await this.prisma.shopifyStore.findUnique({ where: { shopDomain } });
    if (!store) {
      throw new BadRequestException('Butik inte kopplad');
    }

    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-01/products/${productId}.json`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': store.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: updates }),
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Kunde inte uppdatera produkt i Shopify');
    }

    const data = await response.json();
    return data.product;
  }

  /**
   * Synka genererad text till Shopify-produkt
   */
  async syncToProduct(
    shopDomain: string,
    productId: string,
    generatedContent: {
      description: string;
      shortDescription: string;
      metaTitle: string;
      metaDescription: string;
    },
  ) {
    return this.updateProduct(shopDomain, productId, {
      body_html: generatedContent.description,
      metafields_global_title_tag: generatedContent.metaTitle,
      metafields_global_description_tag: generatedContent.metaDescription,
    });
  }

  /**
   * Hämta kopplade butiker för organisation
   */
  async getStores(organizationId: string) {
    return this.prisma.shopifyStore.findMany({
      where: { organizationId },
      select: {
        id: true,
        shopDomain: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
      },
    });
  }

  /**
   * Koppla bort butik
   */
  async disconnectStore(shopDomain: string, organizationId: string) {
    return this.prisma.shopifyStore.delete({
      where: { shopDomain, organizationId },
    });
  }
}
