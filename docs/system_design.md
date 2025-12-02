# Systemdesign & Arkitektur

## Arkitekturöversikt
```mermaid
graph TD
    subgraph Klient
        UI[Next.js UI (svenska)]
    end
    subgraph API
        GW[FastAPI REST]
        MQ[Redis Queue]
        Worker[Celery Workers]
    end
    subgraph Data
        PG[(PostgreSQL)]
        Cache[Redis Cache]
        Storage[(Object Storage - rapporter)]
    end
    subgraph Integrations
        GSC[Google Search Console]
        GAds[Google Ads]
        GAnalytics[Google Analytics]
    end

    UI -->|JWT| GW
    GW --> PG
    GW --> Cache
    GW --> MQ
    MQ --> Worker
    Worker --> PG
    Worker --> Storage
    Worker -->|Adapter| GSC
    Worker --> GAds
    Worker --> GAnalytics
```

## Modulöversikt
- **Autentisering:** JWT och OAuth2. Roller: Admin, Användare, Gäst.
- **Keyword Service:** Hämtar från licensierade API:er, normaliserar till `keywords`-tabell.
- **SERP Service:** Schemalagd hämtning via Playwright crawler och API, lagras i `serp_snapshots`.
- **Audit Service:** Crawlar via Celery worker. Prioritetsberäkning på backend.
- **Backlink Service:** Import från extern leverantör, beräkning av tox-score.
- **AI Content Service:** Promptar LLM (svenskt språk) via AI-provider.
- **Lokal SEO Service:** Kombinerar sökdata med SCB-geodata.

## Datamodell (PostgreSQL)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin','user','guest')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    industry TEXT,
    target_region TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE domains (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    domain_name TEXT NOT NULL,
    visibility_index NUMERIC,
    last_audit_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE keywords (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    keyword TEXT NOT NULL,
    search_volume INT,
    kd_se NUMERIC,
    cpc_sek NUMERIC,
    trend JSONB,
    serp_features TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE serp_snapshots (
    id UUID PRIMARY KEY,
    keyword_id UUID REFERENCES keywords(id),
    collected_at DATE NOT NULL,
    top_results JSONB,
    visibility_score NUMERIC
);

CREATE TABLE audits (
    id UUID PRIMARY KEY,
    domain_id UUID REFERENCES domains(id),
    status TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    summary JSONB
);

CREATE TABLE issues (
    id UUID PRIMARY KEY,
    audit_id UUID REFERENCES audits(id),
    title TEXT,
    impact_score NUMERIC,
    effort_score NUMERIC,
    probability NUMERIC,
    priority NUMERIC,
    status TEXT
);

CREATE TABLE backlinks (
    id UUID PRIMARY KEY,
    domain_id UUID REFERENCES domains(id),
    source_domain TEXT,
    target_url TEXT,
    anchor_text TEXT,
    rel TEXT,
    tox_score NUMERIC,
    discovered_at DATE,
    lost_at DATE
);

CREATE TABLE briefs (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    keyword TEXT,
    outline JSONB,
    tone TEXT,
    cta TEXT,
    suggested_entities TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE connections (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    provider TEXT,
    refresh_token TEXT,
    scopes TEXT[],
    consented_at TIMESTAMPTZ
);
```

## OpenAPI-utdrag
```yaml
openapi: 3.1.0
info:
  title: Svensk SEO-plattform API
  version: 0.1.0
paths:
  /keywords/search:
    post:
      summary: Sökordssökning på Google.se
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
                project_id:
                  type: string
      responses:
        "200":
          description: Lista med sökordsdata
  /keywords/ideas:
    get:
      summary: Relaterade sökordsidéer
      parameters:
        - in: query
          name: query
          schema:
            type: string
        - in: query
          name: region
          schema:
            type: string
      responses:
        "200":
          description: Idéer med long-tail och böjningar
  /serp/top:
    get:
      summary: Toppdomäner & URL:er
      parameters:
        - in: query
          name: keyword
          schema:
            type: string
        - in: query
          name: date
          schema:
            type: string
      responses:
        "200":
          description: SERP-resultat
  /domain/compare:
    post:
      summary: Domän mot domän jämförelse
      responses:
        "200":
          description: Trafikestimat och synlighetsindex
  /audit/start:
    post:
      summary: Starta site audit
      responses:
        "202":
          description: Audit initierad
  /audit/report/{id}:
    get:
      summary: Hämta auditrapport
      responses:
        "200":
          description: Auditresultat
  /backlinks/summary:
    get:
      summary: Länkprofil och tox-score
  /content/brief:
    post:
      summary: Generera svensk innehållsbrief
  /local/keywords:
    get:
      summary: Lokala sökord per region/kommun
```

## Säkerhetskomponenter
- JWT-signering med `HS256` och roterande hemligheter.
- OAuth2 authorization code-flow för externa integrationer.
- Logging via strukturerad JSON till ELK/OpenSearch.
- Rate limiting via Redis-token bucket.

## Driftsättning
- Docker-compose för lokalt, Kubernetes/Railway för backend, Vercel för frontend.
- Celery workers som separata pods/containers.
- Nightly schemalagda jobb för SERP-diff och backlink-refresh.

