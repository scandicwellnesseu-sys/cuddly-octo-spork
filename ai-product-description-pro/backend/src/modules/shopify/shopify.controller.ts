import { Controller, Get, Post, Delete, Query, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShopifyService } from './shopify.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: { sub: string; organizationId: string };
}

@ApiTags('integrations')
@Controller('api/integrations/shopify')
export class ShopifyController {
  constructor(private readonly shopifyService: ShopifyService) {}

  @Get('oauth/url')
  @ApiOperation({ summary: 'Hämta Shopify OAuth URL' })
  getOAuthUrl(@Query('shopDomain') shopDomain: string, @Query('redirectUri') redirectUri: string) {
    const url = this.shopifyService.getOAuthUrl(shopDomain, redirectUri);
    return { url };
  }

  @Post('oauth/callback')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hantera OAuth callback' })
  async handleCallback(
    @Req() req: AuthenticatedRequest,
    @Body() body: { shopDomain: string; code: string },
  ) {
    const accessToken = await this.shopifyService.exchangeToken(
      body.shopDomain,
      body.code,
      req.user.organizationId,
    );
    return { success: true, shopDomain: body.shopDomain };
  }

  @Get('stores')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista kopplade Shopify-butiker' })
  async getStores(@Req() req: AuthenticatedRequest) {
    return this.shopifyService.getStores(req.user.organizationId);
  }

  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hämta produkter från Shopify' })
  async getProducts(@Query('shopDomain') shopDomain: string, @Query('limit') limit?: string) {
    return this.shopifyService.getProducts(shopDomain, limit ? parseInt(limit, 10) : 50);
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Synka genererad text till Shopify-produkt' })
  async syncToProduct(
    @Body()
    body: {
      shopDomain: string;
      productId: string;
      description: string;
      shortDescription: string;
      metaTitle: string;
      metaDescription: string;
    },
  ) {
    return this.shopifyService.syncToProduct(body.shopDomain, body.productId, {
      description: body.description,
      shortDescription: body.shortDescription,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
    });
  }

  @Delete('stores/:shopDomain')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Koppla bort Shopify-butik' })
  async disconnectStore(
    @Req() req: AuthenticatedRequest,
    @Param('shopDomain') shopDomain: string,
  ) {
    await this.shopifyService.disconnectStore(shopDomain, req.user.organizationId);
    return { success: true };
  }
}
