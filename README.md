# ScandicWellness Shopify Theme

Ett Shopify Online Store 2.0-tema för ScandicWellness, din digitala coach för vitaminer och kosttillskott.

## Om detta tema

Detta är ett modernt, responsivt Shopify-tema byggt med Online Store 2.0-arkitekturen. Temat använder JSON-baserade templates och anpassningsbara sektioner som gör det enkelt att redigera i Shopify Theme Editor.

## Temastruktur

```
.
├── layout/
│   └── theme.liquid          # Huvudlayout med head, header, content, footer
├── templates/
│   ├── index.json            # Startsida (hero + featured products)
│   ├── product.json          # Produktsida
│   ├── collection.json       # Kollektionssida
│   └── page.contact.json     # Kontaktsida
├── sections/
│   ├── header.liquid         # Sidhuvud med navigation
│   ├── footer.liquid         # Sidfot
│   ├── hero.liquid           # Hero-sektion för startsidan
│   ├── featured-products.liquid  # Utvalda produkter
│   ├── contact-form.liquid   # Kontaktformulär
│   ├── main-product.liquid   # Produktinformation
│   ├── collection-banner.liquid  # Kollektionsbanner
│   └── main-collection.liquid    # Produktgrid för kollektioner
├── snippets/
│   ├── product-card.liquid   # Produktkort (återanvändbar)
│   ├── product-form.liquid   # Produktformulär med varianter
│   └── meta-tags.liquid      # SEO meta-taggar
├── assets/
│   ├── theme.css             # Huvudstilmall
│   ├── theme.js              # Huvudskript med navigation, formulär, add-to-cart
│   └── global.js             # Globala utilities
├── config/
│   └── settings_schema.json  # Temainställningar (färger, typografi, logo)
├── locales/
│   └── sv.default.json       # Svenska översättningar
└── docs/
    └── original-files/       # Originalfiler från chatbot-appen (arkiverade)
```

## Installation och utveckling

### Förutsättningar

- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install) installerat
- Ett Shopify-partnerkonto eller butik för utveckling

### Lokal utveckling med Shopify CLI

1. **Installera Shopify CLI** (om du inte redan har det):
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Logga in på Shopify**:
   ```bash
   shopify auth login
   ```

3. **Starta utvecklingsservern**:
   ```bash
   shopify theme dev
   ```
   Detta startar en lokal server som synkar ändringar i realtid med din Shopify-butik. Du får en URL där du kan förhandsgranska temat.

4. **Öppna förhandsvisning**:
   Shopify CLI visar en URL (t.ex. `http://127.0.0.1:9292`) där du kan se dina ändringar live.

### Pusha temat till Shopify

För att ladda upp temat till din butik:

```bash
shopify theme push
```

För att ladda upp och publicera direkt:

```bash
shopify theme push --live
```

### Testa ändringar lokalt

1. Kör `shopify theme dev` för att starta utvecklingsservern
2. Gör ändringar i temafiler (Liquid, CSS, JS)
3. Ändringar synkas automatiskt och visas i webbläsaren
4. Testa responsivitet, formulär, navigation och add-to-cart-funktionalitet

## Huvudfunktioner

### Sektioner (editable i Theme Editor)

- **Hero**: Anpassningsbar hero-sektion med titel, undertext och CTA-knapp
- **Featured Products**: Visar utvalda produkter från en vald kollektion
- **Contact Form**: Shopify-kontaktformulär med validering och anti-spam
- **Product Information**: Produktsida med bild, beskrivning, varianter och add-to-cart
- **Collection Grid**: Produktgrid med paginering för kollektioner

### JavaScript-funktionalitet

- **Mobil navigation**: Responsiv meny med hamburger-ikon och ARIA-attribut
- **Formulärvalidering**: Validerar kontaktformulär med användarfeedback
- **Add to Cart via AJAX**: Lägg till produkter i varukorgen utan sidladdning
- **Kundvagnräknare**: Uppdateras automatiskt när produkter läggs till
- **Notifikationer**: Visar bekräftelse när produkter läggs till

### Säkerhet och tillgänglighet

- Liquid-output är escaped där det behövs (`| escape`)
- ARIA-attribut för navigering och formulär
- Honeypot-fält i kontaktformulär för anti-spam
- Responsiv design för alla enheter
- Keyboard navigation (Escape för att stänga menyer)

## Anpassning

### Färger och typografi

Redigera temainställningar i Shopify Admin under **Online Store > Themes > Customize**:
- Primärfärg
- Accentfärg
- Textfärg
- Typsnitt för rubriker och brödtext
- Logo och favicon

### Lägg till egna sektioner

1. Skapa en ny fil i `sections/` med `.liquid`-ändelse
2. Lägg till Liquid-markup och en `{% schema %}` block
3. Sektionen blir tillgänglig i Theme Editor

### Anpassa produktkort

Redigera `snippets/product-card.liquid` för att ändra hur produkter visas i grid.

## Originalfiler

De ursprungliga chattbot-filerna (`index.html`, `styles.css`, `script.js`) finns arkiverade i `docs/original-files/` för referens.

## Support och bidrag

- **Issues**: [GitHub Issues](https://github.com/scandicwellnesseu-sys/cuddly-octo-spork/issues)
- **Dokumentation**: [Shopify Theme Development](https://shopify.dev/docs/themes)

## Licens

Se LICENSE-fil för detaljer.

---

**ScandicWellness** - Din digitala coach för vitaminer och kosttillskott
