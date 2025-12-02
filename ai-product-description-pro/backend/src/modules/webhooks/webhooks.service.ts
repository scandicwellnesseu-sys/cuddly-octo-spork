import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

export interface CreateWebhookDto {
  name: string;
  url: string;
  events: string[];
  secret?: string;
}

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Skapa ny webhook
   */
  async createWebhook(dto: CreateWebhookDto, organizationId: string) {
    // Generera hemlig nyckel om ingen angiven
    const secret = dto.secret || crypto.randomBytes(32).toString('hex');

    const webhook = await this.prisma.webhook.create({
      data: {
        organizationId,
        name: dto.name,
        url: dto.url,
        events: dto.events,
        secret,
        isActive: true,
      },
    });

    this.logger.log(`Webhook skapad: ${webhook.id}`);
    return webhook;
  }

  /**
   * Hämta alla webhooks för organisation
   */
  async getWebhooks(organizationId: string) {
    return this.prisma.webhook.findMany({
      where: { organizationId },
      include: {
        deliveries: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Uppdatera webhook
   */
  async updateWebhook(
    id: string,
    data: Partial<CreateWebhookDto> & { isActive?: boolean },
  ) {
    return this.prisma.webhook.update({
      where: { id },
      data: {
        name: data.name,
        url: data.url,
        events: data.events,
        isActive: data.isActive,
      },
    });
  }

  /**
   * Ta bort webhook
   */
  async deleteWebhook(id: string) {
    await this.prisma.webhook.delete({ where: { id } });
    return { success: true };
  }

  /**
   * Trigga webhooks för ett event
   */
  async triggerWebhooks(
    organizationId: string,
    event: string,
    data: Record<string, unknown>,
  ) {
    // Hämta alla aktiva webhooks som lyssnar på detta event
    const webhooks = await this.prisma.webhook.findMany({
      where: {
        organizationId,
        isActive: true,
        events: { has: event },
      },
    });

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    // Skicka till alla webhooks parallellt
    await Promise.allSettled(
      webhooks.map((webhook) => this.deliverWebhook(webhook, payload)),
    );
  }

  /**
   * Leverera webhook till mottagare
   */
  private async deliverWebhook(
    webhook: { id: string; url: string; secret: string | null },
    payload: WebhookPayload,
  ) {
    const startTime = Date.now();
    const payloadString = JSON.stringify(payload);

    // Skapa HMAC-signatur
    const signature = webhook.secret
      ? this.createSignature(payloadString, webhook.secret)
      : undefined;

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': payload.event,
          'X-Webhook-Timestamp': payload.timestamp,
          ...(signature && { 'X-Webhook-Signature': signature }),
        },
        body: payloadString,
      });

      const responseBody = await response.text();
      const duration = Date.now() - startTime;

      // Logga leverans
      await this.prisma.webhookDelivery.create({
        data: {
          webhookId: webhook.id,
          event: payload.event,
          payload,
          statusCode: response.status,
          responseBody: responseBody.substring(0, 1000),
          duration,
          success: response.ok,
        },
      });

      // Uppdatera webhook med senaste aktivitet
      await this.prisma.webhook.update({
        where: { id: webhook.id },
        data: {
          lastTriggeredAt: new Date(),
          failureCount: response.ok ? 0 : { increment: 1 },
        },
      });

      if (!response.ok) {
        this.logger.warn(
          `Webhook ${webhook.id} returnerade ${response.status}`,
        );
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      // Logga misslyckad leverans
      await this.prisma.webhookDelivery.create({
        data: {
          webhookId: webhook.id,
          event: payload.event,
          payload,
          duration,
          success: false,
          responseBody: error instanceof Error ? error.message : 'Okänt fel',
        },
      });

      await this.prisma.webhook.update({
        where: { id: webhook.id },
        data: { failureCount: { increment: 1 } },
      });

      this.logger.error(`Webhook ${webhook.id} misslyckades: ${error}`);
    }
  }

  /**
   * Skapa HMAC-SHA256 signatur
   */
  private createSignature(payload: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Verifiera inkommande webhook-signatur
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.createSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }

  /**
   * Hämta leveranshistorik för webhook
   */
  async getDeliveryHistory(webhookId: string, limit = 20) {
    return this.prisma.webhookDelivery.findMany({
      where: { webhookId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Skicka om misslyckad leverans
   */
  async retryDelivery(deliveryId: string) {
    const delivery = await this.prisma.webhookDelivery.findUnique({
      where: { id: deliveryId },
      include: { webhook: true },
    });

    if (!delivery) {
      throw new Error('Leverans hittades inte');
    }

    const payload = delivery.payload as WebhookPayload;
    await this.deliverWebhook(delivery.webhook, payload);

    return { success: true };
  }

  /**
   * Testa webhook med exempeldata
   */
  async testWebhook(webhookId: string) {
    const webhook = await this.prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook) {
      throw new Error('Webhook hittades inte');
    }

    const testPayload: WebhookPayload = {
      event: 'test.ping',
      timestamp: new Date().toISOString(),
      data: {
        message: 'Detta är ett testmeddelande från AI Product Description Generator PRO',
      },
    };

    await this.deliverWebhook(webhook, testPayload);
    return { success: true, message: 'Test skickat' };
  }

  /**
   * Tillgängliga webhook-events
   */
  getAvailableEvents(): { event: string; description: string }[] {
    return [
      { event: 'generation.completed', description: 'Produkttext genererad' },
      { event: 'generation.failed', description: 'Generering misslyckades' },
      { event: 'ab_test.completed', description: 'A/B-test avslutat' },
      { event: 'ab_test.winner_found', description: 'Vinnare identifierad' },
      { event: 'publish.completed', description: 'Publicering klar' },
      { event: 'publish.failed', description: 'Publicering misslyckades' },
      { event: 'credits.low', description: 'Låg kreditbalans' },
      { event: 'credits.depleted', description: 'Krediter slut' },
      { event: 'subscription.updated', description: 'Prenumeration ändrad' },
      { event: 'team.member_added', description: 'Teammedlem tillagd' },
    ];
  }
}
