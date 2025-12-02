import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AmazonService, ConnectAmazonDto } from './amazon.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('amazon')
@UseGuards(JwtAuthGuard)
export class AmazonController {
  constructor(private readonly amazonService: AmazonService) {}

  @Post('connect')
  async connectStore(
    @Request() req: { user: { organizationId: string } },
    @Body() dto: ConnectAmazonDto,
  ) {
    return this.amazonService.connectStore(dto, req.user.organizationId);
  }

  @Get('stores')
  async getStores(@Request() req: { user: { organizationId: string } }) {
    return this.amazonService.getStores(req.user.organizationId);
  }

  @Delete('stores/:id')
  async disconnectStore(@Param('id') id: string) {
    return this.amazonService.disconnectStore(id);
  }

  @Get('stores/:id/products')
  async getProducts(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.amazonService.getProducts(id, {
      limit: limit ? parseInt(limit, 10) : undefined,
      cursor,
    });
  }

  @Post('stores/:storeId/products/:asin')
  async updateProduct(
    @Param('storeId') storeId: string,
    @Param('asin') asin: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      bulletPoints?: string[];
    },
  ) {
    return this.amazonService.updateProduct(storeId, asin, body);
  }

  @Post('stores/:storeId/sync')
  async syncFromGeneration(
    @Param('storeId') storeId: string,
    @Body() body: { generationId: string; asin: string },
  ) {
    return this.amazonService.syncFromGeneration(
      storeId,
      body.generationId,
      body.asin,
    );
  }

  @Get('marketplaces')
  async getMarketplaces() {
    return this.amazonService.getAvailableMarketplaces();
  }
}
