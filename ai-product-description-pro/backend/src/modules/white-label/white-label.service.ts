import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface WhiteLabelConfigDto {
  companyName: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customDomain?: string;
  hidePoweredBy?: boolean;
  customEmailFrom?: string;
}

export interface WhiteLabelTheme {
  companyName: string;
  logo: string | null;
  favicon: string | null;
  colors: {
    primary: string;
    secondary: string;
  };
  hidePoweredBy: boolean;
}

@Injectable()
export class WhiteLabelService {
  private readonly logger = new Logger(WhiteLabelService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Skapa eller uppdatera white-label-konfiguration
   */
  async upsertConfig(organizationId: string, dto: WhiteLabelConfigDto) {
    this.logger.log(`Uppdaterar white-label för org: ${organizationId}`);

    // Kontrollera att custom domain inte redan används
    if (dto.customDomain) {
      const existing = await this.prisma.whiteLabelConfig.findUnique({
        where: { customDomain: dto.customDomain },
      });

      if (existing && existing.organizationId !== organizationId) {
        throw new Error('Domänen används redan av en annan organisation');
      }
    }

    const config = await this.prisma.whiteLabelConfig.upsert({
      where: { organizationId },
      update: {
        companyName: dto.companyName,
        logo: dto.logo,
        favicon: dto.favicon,
        primaryColor: dto.primaryColor || '#1E3A8A',
        secondaryColor: dto.secondaryColor || '#FFD700',
        customDomain: dto.customDomain,
        hidePoweredBy: dto.hidePoweredBy || false,
        customEmailFrom: dto.customEmailFrom,
      },
      create: {
        organizationId,
        companyName: dto.companyName,
        logo: dto.logo,
        favicon: dto.favicon,
        primaryColor: dto.primaryColor || '#1E3A8A',
        secondaryColor: dto.secondaryColor || '#FFD700',
        customDomain: dto.customDomain,
        hidePoweredBy: dto.hidePoweredBy || false,
        customEmailFrom: dto.customEmailFrom,
        isActive: false,
      },
    });

    return config;
  }

  /**
   * Hämta white-label-konfiguration
   */
  async getConfig(organizationId: string) {
    const config = await this.prisma.whiteLabelConfig.findUnique({
      where: { organizationId },
    });

    return config;
  }

  /**
   * Aktivera white-label
   */
  async activateWhiteLabel(organizationId: string) {
    // Kontrollera att organisation har Agency-plan
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new NotFoundException('Organisation hittades inte');
    }

    if (org.plan !== 'AGENCY') {
      throw new Error('White-label kräver Agency-plan');
    }

    return this.prisma.whiteLabelConfig.update({
      where: { organizationId },
      data: { isActive: true },
    });
  }

  /**
   * Inaktivera white-label
   */
  async deactivateWhiteLabel(organizationId: string) {
    return this.prisma.whiteLabelConfig.update({
      where: { organizationId },
      data: { isActive: false },
    });
  }

  /**
   * Hämta tema baserat på domän eller organisation
   */
  async getTheme(
    identifier: { domain?: string; organizationId?: string },
  ): Promise<WhiteLabelTheme | null> {
    let config = null;

    if (identifier.domain) {
      config = await this.prisma.whiteLabelConfig.findUnique({
        where: { customDomain: identifier.domain },
      });
    } else if (identifier.organizationId) {
      config = await this.prisma.whiteLabelConfig.findUnique({
        where: { organizationId: identifier.organizationId },
      });
    }

    if (!config || !config.isActive) {
      return null;
    }

    return {
      companyName: config.companyName,
      logo: config.logo,
      favicon: config.favicon,
      colors: {
        primary: config.primaryColor,
        secondary: config.secondaryColor,
      },
      hidePoweredBy: config.hidePoweredBy,
    };
  }

  /**
   * Validera custom domain DNS
   */
  async validateDomain(domain: string): Promise<{
    valid: boolean;
    message: string;
    instructions?: string[];
  }> {
    // Kontrollera att domänen pekar på rätt CNAME
    // I produktion: verifiera DNS-uppsättning
    const expectedCname = 'app.ai-product-description.pro';

    try {
      // Simulerad DNS-kontroll
      // I produktion: använd dns.resolve eller DNS-tjänst
      this.logger.log(`Kontrollerar DNS för: ${domain}`);

      // För demo, returnera instruktioner
      return {
        valid: false,
        message: 'DNS-konfiguration krävs',
        instructions: [
          `Lägg till en CNAME-post för ${domain} som pekar på ${expectedCname}`,
          'Vänta upp till 24 timmar för DNS-propagering',
          'Kontakta support om du behöver hjälp',
        ],
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Kunde inte verifiera domänen',
      };
    }
  }

  /**
   * Generera white-label preview
   */
  async generatePreview(dto: WhiteLabelConfigDto): Promise<{
    html: string;
    css: string;
  }> {
    const css = `
:root {
  --primary-color: ${dto.primaryColor || '#1E3A8A'};
  --secondary-color: ${dto.secondaryColor || '#FFD700'};
}

.brand-logo {
  ${dto.logo ? `background-image: url('${dto.logo}');` : ''}
}

.powered-by {
  ${dto.hidePoweredBy ? 'display: none;' : ''}
}
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${dto.companyName}</title>
  ${dto.favicon ? `<link rel="icon" href="${dto.favicon}">` : ''}
  <style>${css}</style>
</head>
<body>
  <header style="background: var(--primary-color); padding: 1rem; color: white;">
    ${dto.logo ? `<img src="${dto.logo}" alt="${dto.companyName}" height="40">` : `<h1>${dto.companyName}</h1>`}
  </header>
  <main style="padding: 2rem;">
    <h2>Förhandsvisning av White-Label</h2>
    <button style="background: var(--secondary-color); padding: 0.5rem 1rem; border: none; cursor: pointer;">
      Exempel-knapp
    </button>
  </main>
  <footer class="powered-by" style="padding: 1rem; text-align: center; color: #666;">
    Powered by AI Product Description Generator PRO
  </footer>
</body>
</html>
`;

    return { html, css };
  }

  /**
   * Hämta e-postavsändare för organisation
   */
  async getEmailSender(organizationId: string): Promise<{
    from: string;
    name: string;
  }> {
    const config = await this.prisma.whiteLabelConfig.findUnique({
      where: { organizationId },
    });

    if (config?.isActive && config.customEmailFrom) {
      return {
        from: config.customEmailFrom,
        name: config.companyName,
      };
    }

    return {
      from: 'noreply@ai-product-description.pro',
      name: 'AI Product Description Generator PRO',
    };
  }
}
