import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BankIdService, InitiateAuthDto } from './bankid.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bankid')
export class BankIdController {
  constructor(private readonly bankIdService: BankIdService) {}

  @Get('providers')
  async getProviders() {
    return this.bankIdService.getAvailableProviders();
  }

  @Post('initiate')
  async initiateAuth(@Body() dto: InitiateAuthDto) {
    return this.bankIdService.initiateAuth(dto);
  }

  @Get('status/:orderRef')
  async checkStatus(@Param('orderRef') orderRef: string) {
    return this.bankIdService.checkStatus(orderRef);
  }

  @Post('cancel/:orderRef')
  async cancelAuth(@Param('orderRef') orderRef: string) {
    return this.bankIdService.cancelAuth(orderRef);
  }

  @Post('link')
  @UseGuards(JwtAuthGuard)
  async linkToUser(
    @Request() req: { user: { id: string } },
    @Body() body: { orderRef: string },
  ) {
    const success = await this.bankIdService.linkToUser(body.orderRef, req.user.id);
    return { success };
  }

  // Demo-endpoint för att simulera slutförd autentisering
  @Post('demo/complete')
  async simulateComplete(
    @Body()
    body: {
      orderRef: string;
      personalNumber: string;
      name: string;
    },
  ) {
    return this.bankIdService.simulateComplete(
      body.orderRef,
      body.personalNumber,
      body.name,
    );
  }
}
