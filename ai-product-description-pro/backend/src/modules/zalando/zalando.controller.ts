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
import { ZalandoService, ConnectZalandoDto } from './zalando.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('zalando')
@UseGuards(JwtAuthGuard)
export class ZalandoController {
  constructor(private readonly zalandoService: ZalandoService) {}

  @Post('connect')
  async connectStore(
    @Request() req: { user: { organizationId: string } },
    @Body() dto: ConnectZalandoDto,
  ) {
    return this.zalandoService.connectStore(dto, req.user.organizationId);
  }

  @Get('stores')
  async getStores(@Request() req: { user: { organizationId: string } }) {
    return this.zalandoService.getStores(req.user.organizationId);
  }

  @Delete('stores/:id')
  async disconnectStore(@Param('id') id: string) {
    return this.zalandoService.disconnectStore(id);
  }

  @Get('stores/:id/products')
  async getProducts(
    @Param('id') id: string,
    @Query('salesChannel') salesChannel?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.zalandoService.getProducts(id, {
      salesChannel,
      limit: limit ? parseInt(limit, 10) : undefined,
      cursor,
    });
  }

  @Post('stores/:storeId/products/:ean')
  async updateProduct(
    @Param('storeId') storeId: string,
    @Param('ean') ean: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      salesChannel: string;
    },
  ) {
    return this.zalandoService.updateProduct(storeId, ean, body);
  }

  @Post('stores/:storeId/sync')
  async syncFromGeneration(
    @Param('storeId') storeId: string,
    @Body() body: { generationId: string; ean: string; salesChannel: string },
  ) {
    return this.zalandoService.syncFromGeneration(
      storeId,
      body.generationId,
      body.ean,
      body.salesChannel,
    );
  }

  @Get('sales-channels')
  async getSalesChannels() {
    return this.zalandoService.getAvailableSalesChannels();
  }

  @Get('requirements/:salesChannel')
  async getRequirements(@Param('salesChannel') salesChannel: string) {
    return this.zalandoService.getProductRequirements(salesChannel);
  }

  @Post('translate')
  async translateForMarket(
    @Body() body: { generationId: string; targetMarket: string },
  ) {
    return this.zalandoService.translateForMarket(
      body.generationId,
      body.targetMarket,
    );
  }
}
