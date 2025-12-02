# Testplan & CI

## Enhetstester
- Python: pytest för beräkningsfunktioner och API-svar (mock-data).
- Frontend: Jest/React Testing Library (placeholder i MVP med snapshot-test av komponent).

## Integrationstester
- Använd FastAPI TestClient för att testa hela flöden (t.ex. starta audit och hämta rapport).
- Simulera domänjämförelse med flera domäner.

## CI-pipeline (GitHub Actions)
1. `lint-python`: kör `ruff` (v2 plan) eller `flake8` (MVP skip, se TODO).
2. `test-python`: installerar beroenden och kör pytest.
3. `test-frontend`: installerar npm, kör `npm run test`.
4. `build`: validerar Dockerfile (v2).

## Testdata
- Sökord: “ashwagandha gummies”, “vitamin c gummis”, “kollagen tillskott”, “sea moss kapslar”, “probiotika barn”.
- Domäner: scandicwellness.se, apoteket.se, kostdoktorn.se.
- Regioner: Stockholm, Göteborg, Malmö.

## Manuell QA-checklista
- Bekräfta att UI byter språk till svenska (default).
- Testa CSV-export från sökordsflik.
- Trigger audit och kontrollera prioriterad lista.
- Generera innehållsbrief och kontrollera att CTA är på svenska.

## Deployment-validering
- Pre-prod (Railway) röktest: hälsoendpoint `/health` svarar 200.
- Frontend (Vercel) – kontrollera att Next.js-sidor laddas och API-basen pekar rätt.

