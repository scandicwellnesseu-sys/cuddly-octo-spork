# Produktkravsdokument (PRD) – Svensk SEO-plattform

## Översikt
Den svenska SEO-plattformen riktar sig till e-handlare, byråer och tillväxtbolag som behöver ett lokalt anpassat alternativ till Semrush. Fokus för MVP är kärnflödena sökordsanalys, konkurrensinsikter, teknisk audit, länkprofil och AI-stödd innehållsplanering med mockade datakällor. Systemet ska vara utbyggbart för verkliga integrationer i senare versioner.

## Mål & KPI:er
- **Primär KPI:** Antal aktiva projekt (mål: 50 under första kvartalet efter lansering).
- **Sekundära KPI:er:**
  - Exporterade rapporter per månad (mål: 150).
  - Genomsnittlig tid till första audit (mål: < 5 minuter).
  - Nöjdhetsbetyg för AI-briefar (mål: ≥ 4/5).

## Målgruppsproblem
- Svårt att hitta svensk volym- och CPC-data.
- Brist på lokalt anpassad konkurrensanalys.
- Fragmenterade verktyg för tekniska insikter och innehållsplanering.
- Svårt att arbeta GDPR-säkert med flera kundprojekt.

## MVP-omfång
1. **Projekt & domäner** – skapa, tilldela och kategorisera.
2. **Sökordssökning** – volym, KD_SE, CPC i SEK, trend, SERP-features och relaterade sökord.
3. **Konkurrentanalys** – toppdomäner/URL:er, domänjämförelse, SERP-diff.
4. **Site Audit** – starta audit, få prioriterad åtgärdslista.
5. **Backlinks** – summera länkprofil och tox-score.
6. **AI-innehållsbrief** – generera svensk brief med rubrikstruktur och CTA.
7. **Lokal SEO** – kommun/län-filter, "nära mig"-varianter och NAP-kontroller.
8. **Export** – CSV och PDF (genereras i MVP som markdown + instruktion för PDF).
9. **Autentisering & roller** – JWT-baserad inloggning, roller Admin/Användare/Gäst.

## V2+ funktioner
- Riktig länkdatabas, daglig rank tracking, Google Sheets-export, white-labeling, Chrome-extension, teamdelning.

## Antaganden & risker
- API-licenser för sökdata måste förhandlas (Semrush, Ahrefs-alternativ eller egen datapartnerskap).
- Crawling får inte bryta mot robots.txt eller lagar.
- AI-genererade briefs måste kvalitetssäkras för tonläge och korrekthet.

## User Stories (MVP)
- **Som SEO-specialist** vill jag lägga till ett nytt projekt för min kund och spåra deras domänstatus.
- **Som innehållsstrateg** vill jag hitta svenska long-tail-sökord med låg KD_SE för att producera innehåll.
- **Som teknisk konsult** vill jag köra en site audit och få en prioriterad lista över problem.
- **Som byråledare** vill jag exportera rapporter i CSV/PDF för att visa värde för kunder.
- **Som lokal marknadsförare** vill jag identifiera "nära mig"-sökord per kommun.

## Icke-funktionella krav
- UI på svenska, tider och datum i svensk zon.
- Responstider < 500 ms för cacheade endpointar.
- Skalbar backend (containeriserad) med observability-basnivå.
- GDPR-efterlevnad: dataminimering, rätt att bli raderad, aktivitetlogg.

## Milstolpar
1. **Vecka 1-2:** Arkitektur, datamodell, mock-API.
2. **Vecka 3:** Frontend UI, rapportmallar.
3. **Vecka 4:** Tester, CI, dokumentation.
4. **Vecka 5:** Beta-feedback från 5 pilotkunder.

