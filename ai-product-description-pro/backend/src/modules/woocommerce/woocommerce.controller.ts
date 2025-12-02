import { Controller, Get, Post, Delete, Query, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WoocommerceService } from './woocommerce.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: { sub: string; organizationId: string };
}

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/integrations/woocommerce')
export class WoocommerceController {
  constructor(private readonly wooService: WoocommerceService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Koppla WooCommerce-butik' })
  async connectStore(
    @Req() req: AuthenticatedRequest,
    @Body() body: { storeUrl: string; consumerKey: string; consumerSecret: string },
  ) {
    return this.wooService.connectStore(
      req.user.organizationId,
      body.storeUrl,
      body.consumerKey,
      body.consumerSecret,
    );
  }

  @Get('stores')
  @ApiOperation({ summary: 'Lista kopplade WooCommerce-butiker' })
  async getStores(@Req() req: AuthenticatedRequest) {
    return this.wooService.getStores(req.user.organizationId);
  }

  @Get('products')
  @ApiOperation({ summary: 'Hämta produkter från WooCommerce' })
  async getProducts(
    @Query('storeId') storeId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.wooService.getProducts(
      storeId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Post('sync')
  @ApiOperation({ summary: 'Synka genererad text till WooCommerce-produkt' })
  async syncToProduct(
    @Body()
    body: {
      storeId: string;
      productId: number;
      description: string;
      shortDescription: string;
      metaTitle: string;
      metaDescription: string;
    },
  ) {
    return this.wooService.syncToProduct(body.storeId, body.productId, {
      description: body.description,
      shortDescription: body.shortDescription,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
    });
  }

  @Delete('stores/:storeId')
  @ApiOperation({ summary: 'Koppla bort WooCommerce-butik' })
  async disconnectStore(@Req() req: AuthenticatedRequest, @Param('storeId') storeId: string) {
    await this.wooService.disconnectStore(storeId, req.user.organizationId);
    return { success: true };
  }
}
