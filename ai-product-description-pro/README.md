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
- **🛒 E-handelsintegration** - Shopify & WooCommerce direktkoppling
- **💳 Stripe-betalningar** - Prenumerationer och kreditköp
- **👥 Teamkonton** - Roller (owner, editor, viewer) och delade krediter

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
- **OpenAI GPT-4o** (Vision + Text)
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
│   │   │   ├── ai/           # AI-generering (GPT-4o, Claude, OCR)
│   │   │   ├── auth/         # Autentisering (JWT)
│   │   │   ├── users/        # Användarhantering
│   │   │   ├── orgs/         # Organisationer & team
│   │   │   ├── seo/          # SEO-analys & scoring
│   │   │   ├── keywords/     # Nyckelordsmotor
│   │   │   ├── brand-voice/  # Brand Voice Trainer
│   │   │   ├── billing/      # Stripe-betalningar
│   │   │   ├── shopify/      # Shopify-integration
│   │   │   ├── woocommerce/  # WooCommerce-integration
│   │   │   ├── trends/       # Trend-analys
│   │   │   ├── analytics/    # Statistik & diagram
│   │   │   └── files/        # Filuppladdning
│   │   └── prisma/           # Prisma-tjänst
│   ├── prisma/
│   │   └── schema.prisma     # Databasschema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── dashboard/        # Dashboard
│   │   ├── generate/
│   │   │   ├── single/       # Enkel generering
│   │   │   └── bulk/         # Bulkgenerering
│   │   ├── seo-score/        # SEO-analys
│   │   ├── brand-voice/      # Brand Voice
│   │   ├── trends/           # Trendande nyckelord
│   │   ├── billing/          # Betalning
│   │   ├── integrations/
│   │   │   ├── shopify/      # Shopify
│   │   │   └── woocommerce/  # WooCommerce
│   │   └── settings/team/    # Teamhantering
│   ├── components/
│   │   ├── layout/           # Sidebar, Header
│   │   ├── charts/           # SEO Gauge, Charts
│   │   └── ui/               # UI-komponenter
│   ├── lib/
│   │   └── api.ts            # API-klient
│   ├── types/
│   │   └── index.ts          # TypeScript-typer
│   ├── package.json
│   └── tailwind.config.ts
│
├── .env.example
├── package.json              # Monorepo root
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

## 💳 Prismodell

| Plan | Pris | Krediter | Funktioner |
|------|------|----------|------------|
| **Starter** | 0 kr/mån | 10 gratis | Grundläggande generering |
| **Pro** | 490 kr/mån | 500/mån | Brand Voice, Bulk, Flerspråk |
| **Agency** | 2 990 kr/mån | Obegränsat | API, Team, Integrationer |

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
