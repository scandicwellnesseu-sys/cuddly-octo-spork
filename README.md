# App & Hemsida

En responsiv demo av appen och marknadswebben beskriven i startspecifikationen. Lösningen består av en landningssida, dedikerade undersidor samt en klickbar app-prototyp som sparar data lokalt.

## Kom igång

1. Starta en enkel webbserver i projektroten:
   ```bash
   python -m http.server 8000
   ```
2. Besök [http://localhost:8000](http://localhost:8000) och öppna `preview.html` för att växla mellan webb och app i samma vy
   eller navigera mellan sidorna via toppmenyn.

## Struktur

- `index.html` – landningssidan med hero, funktioner, prisöversikt, Profit Lab, Quantum Revenue Forge, Dominance Benchmark, Apex Intelligence Mesh, Capital Readiness Vault, Supremacy Control Nexus och nya Design Studio blueprint-labbet.
- `product.html` – produktfördjupning med flöden, arkitektur, Edge Radar, Helix Execution Forge, Apex Execution Mesh, Capital Readiness Studio, Supremacy Control Studio, Dominansmatrisen och Atlas Vision Grid för designops.
- `pricing.html` – prisplaner med växling mellan månad och år samt ROI-kalkylator.
- `blog/` – blogglista med sök- och taggfilter.
- `legal/` – integritetspolicy och användarvillkor.
- `app/` – interaktiv appvy med demo-auth, objektlistor och delningslänkar.
- `preview.html` – snabböversikt som bäddar in marknadswebben och appen i växlingsbara ramar.
- `design.html` – designsystem och interaktiv designpreview där teman, personas och layouter kan generera blueprint-text.
- `styles.css` – gemensamt designsystem för hela upplevelsen inklusive appen.
- `script.js` – nav-hantering, priskalkyl, bloggfilter samt logik för Profit/Neuro/Intel-labb, Design Studio, Design Preview, Atlas Vision Grid, Apex Suite, Capital Readiness-labb, Supremacy Control Nexus och den nya Dominance/Benchmark-motorn.
- `app/app.js` – logik för login, objekt, delningar, lösenordsskydd, Adaptive Momentum Studio, Quantum Impact Reactor, Vision Blueprint Lab, Dominansconsole, Apex Intelligence Console, Capital Readiness Console och Supremacy Control Console i dashboarden.

## Demo-appens funktioner

- Skapa ett demo-konto med namn och e-post (lagras i `localStorage`).
- Lägg till, redigera och spara objekt. Välj synlighet (privat, länk, lösenord eller publik).
- Generera delningslänkar, kopiera dem och testa lösenordslåsning via `?share=`-parametern.
- Använd profitpanelen för att simulera visningar, registreringar och se beräknad ARR.
- Boost delningar för att testa kampanjspikar, avsluta delningar eller logga ut för att återgå till inloggningsläget.
- Bygg playbooks med Growth Ops Console och Adaptive Momentum Studio för att snabbt fylla editorn med strategier.
- Aktivera Quantum Impact Reactor för att kombinera utfallsmål, pipelines och boosters till sparbara blueprints.
- Skapa presentationsredo innehåll via Vision Blueprint Lab som genererar designmanifest och laddar blueprint direkt i editorn.
- Använd Dominansconsolen för att välja konkurrent, scenario och boosters, kopiera dominansbriefs eller ladda planen direkt i editorn.
- Bygg hypermoderna planer via Apex Intelligence Console och skicka blueprinten rakt in i editorn på ett klick.
- Förbered finansieringsrundor via Capital Readiness Console, kopiera investerarpitchen eller skicka dealplanen direkt till editorn.
- Kör Supremacy Control Console för att kombinera rival, arena och strike-mode, kopiera planen eller ladda blueprinten direkt i editorn.

## Anpassning

- Uppdatera texter, färger och illustrationer direkt i HTML/CSS.
- Anslut riktiga backend-tjänster genom att ersätta demo-auth och `localStorage`-lagringen.
- Bygg vidare på bloggsidan genom att länka till riktiga inlägg eller integrera ett CMS.
