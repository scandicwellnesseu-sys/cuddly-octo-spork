import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { BankIdProvider, BankIdStatus } from '@prisma/client';
import * as crypto from 'crypto';

export interface InitiateAuthDto {
  provider: BankIdProvider;
  personalNumber?: string; // Personnummer (valfritt för mobilt BankID)
}

export interface AuthStatusResult {
  status: BankIdStatus;
  hintCode?: string;
  message: string;
  completionData?: {
    name: string;
    personalNumber: string;
  };
}

@Injectable()
export class BankIdService {
  private readonly logger = new Logger(BankIdService.name);
  private readonly encryptionKey: string;
  private readonly encryptionAlgorithm = 'aes-256-gcm';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Use a dedicated encryption key or fallback to NEXTAUTH_SECRET
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY') 
      || this.configService.get<string>('NEXTAUTH_SECRET') 
      || 'default-key-change-in-production-32';
  }

  /**
   * Encrypt sensitive data (personal numbers)
   */
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv(this.encryptionAlgorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypt sensitive data
   */
  private decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    
    const decipher = crypto.createDecipheriv(this.encryptionAlgorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Starta BankID-autentisering
   */
  async initiateAuth(dto: InitiateAuthDto): Promise<{
    orderRef: string;
    autoStartToken: string;
    qrCode?: string;
  }> {
    this.logger.log(`Startar ${dto.provider} autentisering`);

    // Generera unik orderRef
    const orderRef = crypto.randomUUID();
    const autoStartToken = crypto.randomBytes(32).toString('base64url');

    // Sätt utgångstid (5 minuter)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Spara session
    await this.prisma.bankIdSession.create({
      data: {
        orderRef,
        autoStartToken,
        provider: dto.provider,
        status: BankIdStatus.PENDING,
        expiresAt,
      },
    });

    // I produktion: anropa respektive BankID-tjänst
    switch (dto.provider) {
      case 'BANKID_SE':
        return this.initiateBankIdSE(orderRef, autoStartToken, dto.personalNumber);
      case 'MITID_DK':
        return this.initiateMitIdDK(orderRef, autoStartToken);
      case 'BANKID_NO':
        return this.initiateBankIdNO(orderRef, autoStartToken);
      case 'FTNMT_FI':
        return this.initiateFtnFI(orderRef, autoStartToken);
      default:
        throw new Error(`Okänd provider: ${dto.provider}`);
    }
  }

  /**
   * Kontrollera status för autentisering
   */
  async checkStatus(orderRef: string): Promise<AuthStatusResult> {
    const session = await this.prisma.bankIdSession.findUnique({
      where: { orderRef },
    });

    if (!session) {
      throw new Error('Session hittades inte');
    }

    // Kontrollera utgång
    if (new Date() > session.expiresAt) {
      await this.prisma.bankIdSession.update({
        where: { orderRef },
        data: { status: BankIdStatus.EXPIRED },
      });
      return {
        status: BankIdStatus.EXPIRED,
        message: 'Sessionen har gått ut. Försök igen.',
      };
    }

    // I produktion: anropa BankID collect-endpoint
    // Simulera status-progression för demo
    return this.getStatusForProvider(session);
  }

  /**
   * Avbryt autentisering
   */
  async cancelAuth(orderRef: string): Promise<{ success: boolean }> {
    await this.prisma.bankIdSession.update({
      where: { orderRef },
      data: { status: BankIdStatus.FAILED },
    });

    // I produktion: anropa BankID cancel-endpoint
    this.logger.log(`Avbryter autentisering: ${orderRef}`);

    return { success: true };
  }

  /**
   * Länka BankID till användare efter lyckad autentisering
   */
  async linkToUser(orderRef: string, userId: string): Promise<boolean> {
    const session = await this.prisma.bankIdSession.findUnique({
      where: { orderRef },
    });

    if (!session || session.status !== BankIdStatus.COMPLETED) {
      throw new Error('Ingen giltig session att länka');
    }

    // Uppdatera session med användar-ID
    await this.prisma.bankIdSession.update({
      where: { orderRef },
      data: { userId },
    });

    // Aktivera 2FA för användaren
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return true;
  }

  /**
   * Svenskt BankID
   */
  private async initiateBankIdSE(
    orderRef: string,
    autoStartToken: string,
    personalNumber?: string,
  ): Promise<{
    orderRef: string;
    autoStartToken: string;
    qrCode?: string;
  }> {
    // I produktion: anropa BankID RP API
    // POST https://appapi2.bankid.com/rp/v6/auth
    // {
    //   "personalNumber": "YYYYMMDDXXXX",
    //   "endUserIp": "x.x.x.x",
    //   "requirement": { "tokenStartRequired": false }
    // }

    this.logger.log('Initierar svenskt BankID');

    // Generera QR-kod data (för att starta BankID-app på annan enhet)
    const qrCode = this.generateQrCodeData(autoStartToken);

    return {
      orderRef,
      autoStartToken,
      qrCode,
    };
  }

  /**
   * Danskt MitID
   */
  private async initiateMitIdDK(
    orderRef: string,
    autoStartToken: string,
  ): Promise<{
    orderRef: string;
    autoStartToken: string;
    qrCode?: string;
  }> {
    // I produktion: använd MitID Broker API
    // https://broker.mitid.dk/

    this.logger.log('Initierar danskt MitID');

    return {
      orderRef,
      autoStartToken,
    };
  }

  /**
   * Norskt BankID
   */
  private async initiateBankIdNO(
    orderRef: string,
    autoStartToken: string,
  ): Promise<{
    orderRef: string;
    autoStartToken: string;
  }> {
    // I produktion: använd BankID Norge API
    // https://confluence.bankidnorge.no/confluence/

    this.logger.log('Initierar norskt BankID');

    return {
      orderRef,
      autoStartToken,
    };
  }

  /**
   * Finskt FTN/Mobiilivarmenne
   */
  private async initiateFtnFI(
    orderRef: string,
    autoStartToken: string,
  ): Promise<{
    orderRef: string;
    autoStartToken: string;
  }> {
    // I produktion: använd Finnish Trust Network API

    this.logger.log('Initierar finskt FTN');

    return {
      orderRef,
      autoStartToken,
    };
  }

  /**
   * Generera QR-kod data
   */
  private generateQrCodeData(autoStartToken: string): string {
    // Format: bankid:///?autostarttoken=[TOKEN]
    return `bankid:///?autostarttoken=${autoStartToken}`;
  }

  /**
   * Hämta status baserat på provider
   */
  private async getStatusForProvider(session: {
    orderRef: string;
    provider: BankIdProvider;
    status: BankIdStatus;
  }): Promise<AuthStatusResult> {
    // I produktion: anropa respektive collect-endpoint

    // För demo: simulera pending status
    if (session.status === BankIdStatus.PENDING) {
      // Uppdatera till USER_SIGN för att visa att användaren behöver signera
      await this.prisma.bankIdSession.update({
        where: { orderRef: session.orderRef },
        data: { status: BankIdStatus.USER_SIGN },
      });

      return {
        status: BankIdStatus.USER_SIGN,
        hintCode: 'outstandingTransaction',
        message: this.getMessageForProvider(session.provider, 'USER_SIGN'),
      };
    }

    return {
      status: session.status,
      message: this.getMessageForProvider(session.provider, session.status),
    };
  }

  /**
   * Hämta användarvänligt meddelande
   */
  private getMessageForProvider(
    provider: BankIdProvider,
    status: BankIdStatus | string,
  ): string {
    const messages: Record<string, Record<string, string>> = {
      BANKID_SE: {
        PENDING: 'Startar BankID...',
        USER_SIGN: 'Öppna BankID-appen och legitimera dig',
        COMPLETED: 'Autentisering lyckades',
        FAILED: 'Autentisering misslyckades',
        EXPIRED: 'Tidsgränsen gick ut',
      },
      MITID_DK: {
        PENDING: 'Starter MitID...',
        USER_SIGN: 'Åbn MitID-appen og godkend',
        COMPLETED: 'Godkendelse gennemført',
        FAILED: 'Godkendelse mislykkedes',
        EXPIRED: 'Sessionen er udløbet',
      },
      BANKID_NO: {
        PENDING: 'Starter BankID...',
        USER_SIGN: 'Åpne BankID-appen og godkjenn',
        COMPLETED: 'Autentisering fullført',
        FAILED: 'Autentisering mislyktes',
        EXPIRED: 'Tidsfristen gikk ut',
      },
      FTNMT_FI: {
        PENDING: 'Käynnistetään tunnistautumista...',
        USER_SIGN: 'Avaa tunnistautumissovellus',
        COMPLETED: 'Tunnistautuminen onnistui',
        FAILED: 'Tunnistautuminen epäonnistui',
        EXPIRED: 'Istunto vanheni',
      },
    };

    return messages[provider]?.[status] || 'Bearbetar...';
  }

  /**
   * Simulera slutförd autentisering (för demo)
   */
  async simulateComplete(
    orderRef: string,
    personalNumber: string,
    name: string,
  ): Promise<AuthStatusResult> {
    // Encrypt personal number before storing
    const encryptedPersonalNumber = this.encrypt(personalNumber);
    
    await this.prisma.bankIdSession.update({
      where: { orderRef },
      data: {
        status: BankIdStatus.COMPLETED,
        personalNumber: encryptedPersonalNumber, // Encrypted for GDPR compliance
        name,
        completedAt: new Date(),
      },
    });

    return {
      status: BankIdStatus.COMPLETED,
      message: 'Autentisering lyckades',
      completionData: {
        name,
        personalNumber: this.maskPersonalNumber(personalNumber),
      },
    };
  }

  /**
   * Maskera personnummer för visning
   */
  private maskPersonalNumber(personalNumber: string): string {
    if (personalNumber.length >= 8) {
      return personalNumber.substring(0, 6) + '****';
    }
    return '********';
  }

  /**
   * Hämta tillgängliga providers
   */
  getAvailableProviders(): {
    id: BankIdProvider;
    name: string;
    country: string;
    icon: string;
  }[] {
    return [
      {
        id: BankIdProvider.BANKID_SE,
        name: 'BankID',
        country: 'Sverige',
        icon: '🇸🇪',
      },
      {
        id: BankIdProvider.MITID_DK,
        name: 'MitID',
        country: 'Danmark',
        icon: '🇩🇰',
      },
      {
        id: BankIdProvider.BANKID_NO,
        name: 'BankID',
        country: 'Norge',
        icon: '🇳🇴',
      },
      {
        id: BankIdProvider.FTNMT_FI,
        name: 'Mobiilivarmenne',
        country: 'Finland',
        icon: '🇫🇮',
      },
    ];
  }
}
