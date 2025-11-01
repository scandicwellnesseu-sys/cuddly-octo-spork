from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from . import services

app = FastAPI(
    title="Svensk SEO-plattform API",
    description="Mockat FastAPI-backend för svensk Semrush-modell",
    version="0.1.0",
)


class KeywordQuery(BaseModel):
    query: str
    project_id: str | None = None


class KeywordResult(BaseModel):
    keyword: str
    search_volume: int
    kd_se: float
    cpc_sek: float
    trend: List[int]
    serp_features: List[str]


class DomainCompareRequest(BaseModel):
    primary_domain: str
    competitor_domains: List[str]


class AuditStartRequest(BaseModel):
    domain: str


class ContentBriefRequest(BaseModel):
    keyword: str
    competitors: List[str] = Field(default_factory=list)
    tone: str = "Professionell och hjälpsam"
    cta_type: str = "Boka konsultation"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.post("/keywords/search", response_model=List[KeywordResult])
def keywords_search(payload: KeywordQuery) -> List[KeywordResult]:
    return services.search_keywords(payload.query)


@app.get("/keywords/ideas", response_model=List[KeywordResult])
def keywords_ideas(query: str, region: str | None = None) -> List[KeywordResult]:
    return services.keyword_ideas(query, region)


@app.get("/serp/top")
def serp_top(keyword: str, date: str | None = None) -> dict:
    return services.serp_top(keyword, date)


@app.post("/domain/compare")
def domain_compare(payload: DomainCompareRequest) -> dict:
    return services.compare_domains(payload.primary_domain, payload.competitor_domains)


@app.post("/audit/start", status_code=202)
def audit_start(payload: AuditStartRequest) -> dict:
    return services.start_audit(payload.domain)


@app.get("/audit/report/{audit_id}")
def audit_report(audit_id: str) -> dict:
    report = services.get_audit_report(audit_id)
    if not report:
        raise HTTPException(status_code=404, detail="Audit hittades inte")
    return report


@app.get("/backlinks/summary")
def backlinks_summary(domain: str) -> dict:
    return services.backlinks_summary(domain)


@app.post("/content/brief")
def content_brief(payload: ContentBriefRequest) -> dict:
    return services.generate_content_brief(
        keyword=payload.keyword,
        competitors=payload.competitors,
        tone=payload.tone,
        cta_type=payload.cta_type,
    )


@app.get("/local/keywords", response_model=List[KeywordResult])
def local_keywords(region: str, query: str | None = None) -> List[KeywordResult]:
    return services.local_keywords(region, query)


@app.get("/projects")
def list_projects() -> list[dict]:
    return services.list_projects()


@app.post("/projects")
def create_project(project: dict) -> dict:
    return services.create_project(project)

