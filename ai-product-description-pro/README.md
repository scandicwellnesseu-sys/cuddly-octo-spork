# AI Product Description Generator PRO 🚀

> Nordens mest avancerade SaaS-plattform för AI-driven produkttextgenerering

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red.svg)](https://nestjs.com/)

## 📋 Översikt

AI Product Description Generator PRO är ett svenskt/nordiskt SaaS-verktyg för e-handlare, byråer och återförsäljare som genererar SEO-optimerade produkttexter från bilder, titlar och nyckelord.

### ✨ Huvudfunktioner

- **🤖 AI-Driven Textgenerering** - GPT-4o Vision + Claude 3.5 Sonnet för bildanalys och textgenerering
- **🔍 Google Vision OCR** - Extraherar text från produktbilder automatiskt
- **📊 SEO-Scoring** - Beräknar SEO-poäng, läsbarhet och keyword density
- **🎯 Keyword Engine** - Automatiska long-tail nyckelord från trender
- **🎤 Brand Voice Trainer** - Lär AI din unika ton och stil
- **🌍 Flerspråkighet** - Svenska, engelska, norska, danska, finska, tyska
- **📈 Trend-detektor** - Analyserar TikTok, Instagram & Google Trends
- **🛒 E-handelsintegration** - Shopify, WooCommerce, Amazon & Zalando
- **💳 Stripe-betalningar** - Prenumerationer och kreditköp
- **👥 Teamkonton** - Roller (owner, editor, viewer) och delade krediter

### 🚀 PRO-funktioner (Marknadens bästa)

- **🧪 A/B-testning** - Testa produkttexter och se vilka som konverterar bäst
- **🎨 AI-bildgenerering** - Skapa produktbilder med DALL-E 3
- **📝 Plagiatkontroll** - Verifiera att texter är unika
- **🎯 Konkurrentanalys** - Analysera konkurrenters produkttexter
- **📅 Automatisk publicering** - Schemalägg publicering till alla plattformar
- **🔗 Webhooks/Zapier** - Automatisera arbetsflöden
- **🏷️ White-Label** - Byråer kan sälja under eget varumärke
- **🔐 BankID/MitID** - Nordisk säker inloggning
- **🧩 Chrome Extension** - Generera direkt i webbläsaren

## 🛠️ Teknisk Stack

### Frontend
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** med Lyxify-tema
- **React Query / TanStack Query**
- **NextAuth** (JWT-autentisering)
- **Framer Motion** (animationer)
- **Recharts** (dashboard-diagram)
- **React Hot Toast** (notifikationer)

### Backend
- **NestJS** (TypeScript)
- **Prisma ORM** med PostgreSQL
- **OpenAI GPT-4o** (Vision + Text + DALL-E)
- **Anthropic Claude 3.5 Sonnet** (fallback)
- **Google Cloud Vision API** (OCR)
- **Stripe API** (subscriptions + credits)
- **AWS S3 / Cloudflare R2** (fillagring)

## 📁 Projektstruktur

```
ai-product-description-pro/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── ai/                  # AI-generering (GPT-4o, Claude, OCR)
│   │   │   ├── auth/                # Autentisering (JWT)
│   │   │   ├── users/               # Användarhantering
│   │   │   ├── orgs/                # Organisationer & team
│   │   │   ├── seo/                 # SEO-analys & scoring
│   │   │   ├── keywords/            # Nyckelordsmotor
│   │   │   ├── brand-voice/         # Brand Voice Trainer
│   │   │   ├── billing/             # Stripe-betalningar
│   │   │   ├── shopify/             # Shopify-integration
│   │   │   ├── woocommerce/         # WooCommerce-integration
│   │   │   ├── amazon/              # Amazon Seller Central
│   │   │   ├── zalando/             # Zalando Partner Program
│   │   │   ├── trends/              # Trend-analys
│   │   │   ├── analytics/           # Statistik & diagram
│   │   │   ├── files/               # Filuppladdning
│   │   │   ├── ab-testing/          # A/B-testning
│   │   │   ├── image-generation/    # DALL-E bildgenerering
│   │   │   ├── plagiarism/          # Plagiatkontroll
│   │   │   ├── competitor-analysis/ # Konkurrentanalys
│   │   │   ├── scheduled-publishing/# Schemalagd publicering
│   │   │   ├── webhooks/            # Webhooks & automation
│   │   │   ├── white-label/         # White-label konfiguration
│   │   │   └── bankid/              # BankID/MitID autentisering
│   │   └── prisma/                  # Prisma-tjänst
│   ├── prisma/
│   │   └── schema.prisma            # Databasschema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── dashboard/               # Dashboard
│   │   ├── generate/
│   │   │   ├── single/              # Enkel generering
│   │   │   └── bulk/                # Bulkgenerering
│   │   ├── seo-score/               # SEO-analys
│   │   ├── brand-voice/             # Brand Voice
│   │   ├── trends/                  # Trendande nyckelord
│   │   ├── billing/                 # Betalning
│   │   ├── ab-testing/              # A/B-testning
│   │   ├── image-generation/        # AI-bildgenerering
│   │   ├── plagiarism/              # Plagiatkontroll
│   │   ├── competitor-analysis/     # Konkurrentanalys
│   │   ├── webhooks/                # Webhooks
│   │   ├── white-label/             # White-label
│   │   ├── auth/bankid/             # BankID inloggning
│   │   ├── integrations/
│   │   │   ├── shopify/             # Shopify
│   │   │   ├── woocommerce/         # WooCommerce
│   │   │   ├── amazon/              # Amazon
│   │   │   └── zalando/             # Zalando
│   │   └── settings/team/           # Teamhantering
│   ├── components/
│   │   ├── layout/                  # Sidebar, Header
│   │   ├── charts/                  # SEO Gauge, Charts
│   │   └── ui/                      # UI-komponenter
│   ├── lib/
│   │   └── api.ts                   # API-klient
│   ├── types/
│   │   └── index.ts                 # TypeScript-typer
│   ├── package.json
│   └── tailwind.config.ts
│
├── chrome-extension/                # Chrome Extension
│   ├── manifest.json
│   ├── src/
│   │   ├── popup/                   # Extension popup
│   │   ├── content/                 # Content scripts
│   │   └── background/              # Background worker
│   └── README.md
│
├── .env.example
├── package.json                     # Monorepo root
└── README.md
```

## 🚀 Kom igång

### Förutsättningar

- Node.js 18+
- PostgreSQL 14+
- npm eller yarn

### Installation

1. **Klona repositoryt**
```bash
git clone https://github.com/your-org/ai-product-description-pro.git
cd ai-product-description-pro
```

2. **Installera beroenden**
```bash
npm install
```

3. **Konfigurera miljövariabler**
```bash
cp .env.example .env
# Redigera .env med dina API-nycklar
```

4. **Sätt upp databasen**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. **Starta utvecklingsservrar**
```bash
# I rotmappen
npm run dev
# Eller separat:
cd backend && npm run dev
cd frontend && npm run dev
```

Backend körs på `http://localhost:4000`
Frontend körs på `http://localhost:3000`
Swagger dokumentation: `http://localhost:4000/api/docs`

### Chrome Extension

```bash
cd chrome-extension
# Ladda mappen som okomprimerat tillägg i Chrome
# chrome://extensions/ → Utvecklarläge → Läs in okomprimerat
```

## 💳 Prismodell

| Plan | Pris | Krediter | Funktioner |
|------|------|----------|------------|
| **Starter** | 0 kr/mån | 10 gratis | Grundläggande generering |
| **Pro** | 490 kr/mån | 500/mån | Brand Voice, Bulk, Flerspråk, A/B-testning |
| **Agency** | 2 990 kr/mån | Obegränsat | API, Team, White-label, Alla integrationer |

### Add-ons
- **AI-bildgenerering**: 99 kr/mån (50 bilder)
- **Konkurrentanalys**: 199 kr/mån (10 analyser)
- **Avancerad A/B-testning**: 299 kr/mån

## 🎨 Design

Färgtema (Lyxify):
- **Primär**: `#1E3A8A` (mörkblå)
- **Accent**: `#FFD700` (guld)
- **Ljusblå**: `#E2ECFD`
- **Svart**: `#000000`

Typsnitt:
- **Rubriker**: Poppins
- **Brödtext**: Inter

## 📚 API-dokumentation

### Generera produkttext
```bash
POST /api/ai/generate
Authorization: Bearer <token>

{
  "imageUrls": ["https://..."],
  "title": "Ekologisk T-shirt",
  "keywords": ["ekologisk", "bomull"],
  "language": "SV",
  "brandVoiceId": "optional-id"
}
```

### Svarsformat
```json
{
  "description": "Mjuk ekologisk bomullströja...",
  "shortDescription": "Unisex-T-shirt i ekologisk bomull.",
  "seo": {
    "metaTitle": "Ekologisk T-shirt | Scandinavian Style",
    "metaDescription": "Upptäck vår T-shirt i 100 % ekologisk bomull...",
    "slug": "ekologisk-tshirt"
  },
  "altTexts": ["Vit T-shirt i ekologisk bomull på grå bakgrund"],
  "attributes": {
    "color": "vit",
    "material": "bomull",
    "category": "t-shirts",
    "tags": ["ekologisk", "minimalistisk"]
  },
  "confidenceScore": 0.95,
  "seoScore": 91,
  "readabilityGrade": "A"
}
```

## 🔧 Miljövariabler

Se `.env.example` för fullständig lista. Viktigaste:

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="min-32-tecken"

# AI
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google Cloud Vision
GOOGLE_CLOUD_PROJECT_ID="..."

# BankID (optional)
BANKID_API_URL="https://appapi2.bankid.com/rp/v6"
BANKID_PFX_PATH="./certs/bankid.p12"
```

## 🤝 Bidra

1. Forka repositoryt
2. Skapa en feature-branch (`git checkout -b feature/amazing-feature`)
3. Committa ändringar (`git commit -m 'Add amazing feature'`)
4. Pusha till branchen (`git push origin feature/amazing-feature`)
5. Öppna en Pull Request

## 📄 Licens

Detta projekt är licensierat under MIT-licensen - se [LICENSE](LICENSE) för detaljer.

## 👨‍💻 Utvecklat av

ScandicWellness - Skapat i Sverige 🇸🇪

---

⭐ Om du gillar projektet, ge det en stjärna på GitHub!
