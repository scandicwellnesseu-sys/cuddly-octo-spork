# GDPR & Säkerhetsplan

## Dataminimering
- Endast nödvändiga personuppgifter lagras: e-post, roll, aktivitetsloggar.
- Rapporter anonymiserar användare och kunder med projekt-ID.
- Möjlighet att stänga av loggning av kunddata per projekt.

## Samtycke & rättigheter
- Onboarding-flöde kräver explicit samtycke för API-integrationer.
- "Radera mig"-funktion tar bort användarkonto, anonymiserar projektägare och raderar tokens.
- Export av personuppgifter via `/users/me/export` (v2).

## Åtkomst & roller
- RBAC: Admin kan hantera organisation och fakturering. Användare ser egna projekt. Gäst får läsrättigheter.
- Auditloggar för inloggningar, exports, rapportgenerering.

## Säkerhetsåtgärder
- HTTPS överallt, HSTS och säkra cookies för frontend.
- JWT med 60 min utgång + refresh tokens. Tokens lagras inte i LocalStorage utan i httpOnly cookies.
- Secret rotation via Vault/GitHub Actions hemligheter.
- Rate limiting per användare/IP, skydd mot brute force.
- Crawler följer robots.txt och respekterar crawl-delay.

## Databehandling & retention
- Projektdata lagras 24 månader, därefter arkiveras eller anonymiseras.
- Backups krypterade (AES-256) och roterade veckovis.
- Loggar sparas 12 månader för revision.

## Incidentrespons
1. Detektion via monitorering och larm.
2. Incident-team aktiveras, RCA inom 48h.
3. Rapportering till IMY och drabbade kunder inom 72h.

