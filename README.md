# Svensk SEO-plattform – Semrush-modell för Google.se

Denna repo innehåller en MVP-prototyp av en svensk SEO-plattform med mockad data. Lösningen inkluderar produktplan (PRD), systemdesign, FastAPI-backend, Next.js-frontend, rapportexempel, tester och CI-pipeline.

## Innehåll
- `docs/` – PRD, arkitektur, algoritmer, UX, testplan, GDPR, backlog.
- `backend/` – FastAPI-app med mockade endpointar.
- `frontend/` – Next.js-gränssnitt på svenska.
- `reports/` – Exempelrapporter (Markdown + CSV-schema).
- `.github/workflows/ci.yml` – GitHub Actions-pipeline.

## Krav & installation

### Backend (lokalt)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```
Backend exponeras på `http://localhost:8000` med Swagger på `/docs`.

### Frontend (lokalt)
```bash
cd frontend
npm install
npm run dev
```
Frontend lyssnar på `http://localhost:3000` och anropar backend på `localhost:8000`.

### Docker (kombinerad)
> TODO i v2: docker-compose för backend/worker/frontend.

## Miljövariabler
- `DB_URL` – PostgreSQL-anslutning (Mock i MVP).
- `REDIS_URL` – Redis för cache/kö.
- `JWT_SECRET` – Hemlighet för JWT-signering.
- `API_KEYS_*` – Integrationer (Search Console, Ads m.fl.).

## Testning
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm install
npm run test
```

## Deploy-strategi
- Backend → Railway (FastAPI + PostgreSQL + Redis).
- Frontend → Vercel (Next.js).
- Worker → Railway (Celery + Redis).

## GDPR & Säkerhet
Se `docs/gdpr_security.md` för processer kring dataminimering, samtycke och incidentrespons.

## Rapportexport
Rapporter i `reports/` kan konverteras till PDF med exempelvis `pandoc`.

