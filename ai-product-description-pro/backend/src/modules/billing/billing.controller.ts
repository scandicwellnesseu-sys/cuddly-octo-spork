import { Controller, Get, Post, Body, UseGuards, Req, RawBodyRequest, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Plan } from '@prisma/client';

interface AuthenticatedRequest {
  user: { sub: string; organizationId: string };
}

@ApiTags('billing')
@Controller('api/billing')
export class BillingController {
  private stripe: Stripe | null = null;

  constructor(
    private readonly billingService: BillingService,
    private configService: ConfigService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hämta prenumerationsstatus' })
  async getStatus(@Req() req: AuthenticatedRequest) {
    return this.billingService.getSubscriptionStatus(req.user.organizationId);
  }

  @Post('checkout/subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Skapa checkout för prenumeration' })
  async createSubscriptionCheckout(
    @Req() req: AuthenticatedRequest,
    @Body() body: { plan: Plan; successUrl: string; cancelUrl: string },
  ) {
    return this.billingService.createCheckoutSession(
      req.user.organizationId,
      body.plan,
      body.successUrl,
      body.cancelUrl,
    );
  }

  @Post('checkout/credits')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Skapa checkout för kreditköp' })
  async createCreditsCheckout(
    @Req() req: AuthenticatedRequest,
    @Body() body: { credits: number; successUrl: string; cancelUrl: string },
  ) {
    return this.billingService.createCreditsCheckout(
      req.user.organizationId,
      body.credits,
      body.successUrl,
      body.cancelUrl,
    );
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hämta fakturhistorik' })
  async getInvoices(@Req() req: AuthenticatedRequest) {
    return this.billingService.getInvoices(req.user.organizationId);
  }

  @Get('credits/logs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hämta credit-logg' })
  async getCreditLogs(@Req() req: AuthenticatedRequest) {
    return this.billingService.getCreditLogs(req.user.organizationId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!this.stripe) {
      return { received: false };
    }

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret || !req.rawBody) {
      return { received: false };
    }

    try {
      const event = this.stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
      await this.billingService.handleWebhook(event);
      return { received: true };
    } catch {
      return { received: false };
    }
  }
}
