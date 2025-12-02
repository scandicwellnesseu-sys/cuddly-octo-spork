import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { Plan } from '@prisma/client';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private stripe: Stripe | null = null;

  private readonly planCredits: Record<Plan, number> = {
    STARTER: 10,
    PRO: 500,
    AGENCY: -1, // Obegränsat
  };

  private readonly planPrices: Record<Plan, number> = {
    STARTER: 0,
    PRO: 490,
    AGENCY: 2990,
  };

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    }
  }

  /**
   * Skapa Stripe-kund för organisation
   */
  async createCustomer(organizationId: string, email: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe ej konfigurerat');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (org?.stripeCustomerId) {
      return org.stripeCustomerId;
    }

    const customer = await this.stripe.customers.create({
      email,
      metadata: { organizationId },
    });

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  /**
   * Skapa checkout-session för prenumeration
   */
  async createCheckoutSession(
    organizationId: string,
    plan: Plan,
    successUrl: string,
    cancelUrl: string,
  ) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe ej konfigurerat');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org?.stripeCustomerId) {
      throw new BadRequestException('Ingen Stripe-kund kopplad');
    }

    const priceId = this.configService.get<string>(`STRIPE_PRICE_${plan}`);

    const session = await this.stripe.checkout.sessions.create({
      customer: org.stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { organizationId, plan },
    });

    return { sessionId: session.id, url: session.url };
  }

  /**
   * Skapa checkout för engångsköp av credits
   */
  async createCreditsCheckout(
    organizationId: string,
    credits: number,
    successUrl: string,
    cancelUrl: string,
  ) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe ej konfigurerat');
    }

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org?.stripeCustomerId) {
      throw new BadRequestException('Ingen Stripe-kund kopplad');
    }

    const pricePerCredit = 1; // 1 kr per credit
    const amount = credits * pricePerCredit * 100; // I öre

    const session = await this.stripe.checkout.sessions.create({
      customer: org.stripeCustomerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `${credits} AI-krediter`,
              description: 'Krediter för AI-textgenerering',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { organizationId, credits: String(credits) },
    });

    return { sessionId: session.id, url: session.url };
  }

  /**
   * Hantera Stripe webhook
   */
  async handleWebhook(event: Stripe.Event) {
    this.logger.log(`Webhook mottagen: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const organizationId = session.metadata?.organizationId;
    if (!organizationId) return;

    // Om det är ett kreditköp
    if (session.metadata?.credits) {
      const credits = parseInt(session.metadata.credits, 10);
      await this.addCredits(organizationId, credits, 'Kreditköp');
    }

    // Om det är en prenumeration
    if (session.metadata?.plan) {
      const plan = session.metadata.plan as Plan;
      await this.updatePlan(organizationId, plan, session.subscription as string);
    }
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;
    const org = await this.prisma.organization.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (org) {
      await this.prisma.invoice.create({
        data: {
          organizationId: org.id,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency.toUpperCase(),
          status: 'PAID',
          paidAt: new Date(),
        },
      });
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const org = await this.prisma.organization.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (org) {
      await this.prisma.organization.update({
        where: { id: org.id },
        data: { stripeSubscriptionId: subscription.id },
      });
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const org = await this.prisma.organization.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (org) {
      await this.prisma.organization.update({
        where: { id: org.id },
        data: {
          plan: 'STARTER',
          stripeSubscriptionId: null,
        },
      });
    }
  }

  /**
   * Uppdatera prenumerationsplan
   */
  async updatePlan(organizationId: string, plan: Plan, subscriptionId?: string) {
    const credits = this.planCredits[plan];

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        plan,
        creditsBalance: credits === -1 ? 999999 : credits,
        stripeSubscriptionId: subscriptionId,
        creditsResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dagar
      },
    });
  }

  /**
   * Lägg till credits
   */
  async addCredits(organizationId: string, amount: number, reason: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) return;

    const newBalance = org.creditsBalance + amount;

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { creditsBalance: newBalance },
    });

    await this.prisma.creditLog.create({
      data: {
        organizationId,
        amount,
        balanceAfter: newBalance,
        reason,
      },
    });
  }

  /**
   * Dra av credits
   */
  async useCredits(organizationId: string, amount: number, reason: string, referenceId?: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new BadRequestException('Organisation hittades inte');
    }

    // Agency-plan har obegränsat
    if (org.plan === 'AGENCY') {
      await this.prisma.creditLog.create({
        data: {
          organizationId,
          amount: -amount,
          balanceAfter: org.creditsBalance,
          reason,
          referenceId,
          referenceType: 'generation',
        },
      });
      return true;
    }

    if (org.creditsBalance < amount) {
      throw new BadRequestException('Otillräckliga credits');
    }

    const newBalance = org.creditsBalance - amount;

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { creditsBalance: newBalance },
    });

    await this.prisma.creditLog.create({
      data: {
        organizationId,
        amount: -amount,
        balanceAfter: newBalance,
        reason,
        referenceId,
        referenceType: 'generation',
      },
    });

    return true;
  }

  /**
   * Hämta fakturhistorik
   */
  async getInvoices(organizationId: string) {
    return this.prisma.invoice.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Hämta credit-logg
   */
  async getCreditLogs(organizationId: string, limit = 50) {
    return this.prisma.creditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Hämta aktuell prenumerationsstatus
   */
  async getSubscriptionStatus(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        plan: true,
        creditsBalance: true,
        creditsResetAt: true,
        stripeSubscriptionId: true,
      },
    });

    if (!org) {
      throw new BadRequestException('Organisation hittades inte');
    }

    return {
      plan: org.plan,
      planName: org.plan === 'STARTER' ? 'Starter' : org.plan === 'PRO' ? 'Pro' : 'Agency',
      price: this.planPrices[org.plan],
      creditsBalance: org.creditsBalance,
      creditsIncluded: this.planCredits[org.plan],
      nextReset: org.creditsResetAt,
      hasActiveSubscription: !!org.stripeSubscriptionId,
    };
  }
}
