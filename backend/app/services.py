"""Mockade datatjänster för MVP."""
from __future__ import annotations

from datetime import datetime
from typing import List

from . import utils

PROJECTS = [
    {
        "id": "proj-1",
        "name": "Hälsokost Sverige",
        "industry": "Kosttillskott",
        "target_region": "Sverige",
        "created_at": "2024-01-04T10:00:00Z",
    }
]

KEYWORD_DATA = {
    "ashwagandha gummies": {
        "search_volume": 1900,
        "kd_se": utils.calculate_kd_se(52, 47, 55),
        "cpc_sek": 14.5,
        "trend": [1500, 1600, 1700, 1750, 1800, 1850, 1900, 2000, 2050, 2100, 2150, 2200],
        "serp_features": ["Shopping", "Video", "People also ask"],
    },
    "vitamin c gummis": {
        "search_volume": 1300,
        "kd_se": utils.calculate_kd_se(46, 40, 42),
        "cpc_sek": 9.8,
        "trend": [900, 950, 970, 1000, 1020, 1080, 1150, 1200, 1250, 1300, 1320, 1350],
        "serp_features": ["Shopping", "Recensioner"],
    },
    "kollagen tillskott": {
        "search_volume": 4400,
        "kd_se": utils.calculate_kd_se(60, 58, 62),
        "cpc_sek": 21.3,
        "trend": [3800, 3900, 3950, 4000, 4100, 4200, 4300, 4350, 4400, 4500, 4600, 4700],
        "serp_features": ["Top stories", "People also ask"],
    },
    "sea moss kapslar": {
        "search_volume": 880,
        "kd_se": utils.calculate_kd_se(40, 32, 38),
        "cpc_sek": 13.7,
        "trend": [500, 520, 540, 560, 600, 620, 650, 700, 750, 800, 850, 880],
        "serp_features": ["Shopping"],
    },
    "probiotika barn": {
        "search_volume": 2400,
        "kd_se": utils.calculate_kd_se(48, 44, 50),
        "cpc_sek": 16.0,
        "trend": [2000, 2050, 2100, 2120, 2150, 2200, 2250, 2300, 2350, 2380, 2400, 2450],
        "serp_features": ["People also ask", "Video"],
    },
}

SERP_DATA = {
    "ashwagandha gummies": {
        "collected_at": "2024-04-10",
        "top_domains": [
            {"domain": "apoteket.se", "url": "https://www.apoteket.se/ashwagandha-gummies", "position": 1},
            {"domain": "kostdoktorn.se", "url": "https://www.kostdoktorn.se/ashwagandha", "position": 2},
            {"domain": "scandicwellness.se", "url": "https://www.scandicwellness.se/ashwagandha-gummies", "position": 3},
        ],
        "serp_diff": "Stabila topp-3, ny video-snutt från YouTube",
    }
}

AUDIT_REPORTS = {
    "audit-scandicwellness": {
        "domain": "scandicwellness.se",
        "status": "klar",
        "completed_at": "2024-04-11T09:30:00Z",
        "issues": [
            {
                "title": "Saknad H1 på /produkter/ashwagandha",
                "impact_score": 0.6,
                "effort_score": 0.3,
                "probability": 0.8,
                "priority": utils.calculate_priority(0.6, 0.8, 0.3),
            },
            {
                "title": "Långsam LCP på startsida",
                "impact_score": 0.7,
                "effort_score": 0.5,
                "probability": 0.7,
                "priority": utils.calculate_priority(0.7, 0.7, 0.5),
            },
        ],
        "core_web_vitals": {
            "lcp": 3.1,
            "fid": 75,
            "cls": 0.11,
        },
        "summary": "Fokusera på rubriker och CWV-optimering för produktkategorier.",
    }
}

BACKLINKS = {
    "scandicwellness.se": {
        "total_domains": 45,
        "dofollow": 120,
        "nofollow": 30,
        "tox_score": utils.calculate_tox_score("ASHWAGANDHA", ".xyz", 32, 3),
        "top_anchors": [
            {"anchor": "ashwagandha gummies", "count": 35},
            {"anchor": "scandic wellness", "count": 22},
        ],
        "new_links": 5,
        "lost_links": 2,
    }
}

LOCAL_KEYWORDS = {
    "stockholm": [
        {"keyword": "ashwagandha butik stockholm", "search_volume": 150, "kd_se": 36, "cpc_sek": 12.5,
         "trend": [90, 95, 100, 110, 120, 130, 135, 140, 145, 150, 152, 155], "serp_features": ["Maps"]},
        {"keyword": "hälsokost odenplan", "search_volume": 210, "kd_se": 42, "cpc_sek": 9.7,
         "trend": [180, 182, 185, 188, 190, 195, 198, 200, 202, 205, 208, 210], "serp_features": ["Local pack"]},
    ],
    "göteborg": [
        {"keyword": "probiotika barn göteborg", "search_volume": 120, "kd_se": 44, "cpc_sek": 10.1,
         "trend": [80, 85, 90, 93, 96, 100, 105, 110, 112, 115, 118, 120], "serp_features": ["Local pack"]}
    ],
    "malmö": [
        {"keyword": "vitamin c gummis malmö", "search_volume": 90, "kd_se": 38, "cpc_sek": 11.2,
         "trend": [60, 62, 65, 68, 70, 75, 78, 80, 82, 85, 88, 90], "serp_features": ["Maps"]}
    ],
}


def search_keywords(query: str) -> List[dict]:
    results = []
    for keyword, data in KEYWORD_DATA.items():
        if query.lower() in keyword.lower():
            results.append({"keyword": keyword, **data})
    if not results:
        return [
            {"keyword": query, "search_volume": 0, "kd_se": 0.0, "cpc_sek": 0.0, "trend": [], "serp_features": []}
        ]
    return results


def keyword_ideas(query: str, region: str | None) -> List[dict]:
    base = search_keywords(query)
    ideas = []
    for item in base:
        ideas.append(item)
        ideas.append(
            {
                "keyword": f"{item['keyword']} guide",
                "search_volume": int(item["search_volume"] * 0.4),
                "kd_se": round(item["kd_se"] * 0.8, 2),
                "cpc_sek": round(item["cpc_sek"] * 0.7, 2),
                "trend": item["trend"][-6:],
                "serp_features": ["People also ask"],
            }
        )
    if region:
        for local in LOCAL_KEYWORDS.get(region.lower(), []):
            if query.lower() in local["keyword"]:
                ideas.append(local)
    return ideas[:6]


def serp_top(keyword: str, date: str | None) -> dict:
    serp = SERP_DATA.get(keyword)
    if not serp:
        return {"keyword": keyword, "top_domains": [], "collected_at": date or datetime.utcnow().date().isoformat()}
    return serp


def compare_domains(primary: str, competitors: List[str]) -> dict:
    sample_positions = [
        (1, 2400),
        (4, 1300),
        (7, 880),
    ]
    visibility = utils.calculate_visibility(sample_positions)
    competitor_overview = []
    for competitor in competitors:
        competitor_overview.append(
            {
                "domain": competitor,
                "shared_keywords": 120,
                "missed_keywords": 80,
                "estimated_traffic": 18000,
            }
        )
    return {
        "primary_domain": primary,
        "visibility_index": visibility,
        "competitors": competitor_overview,
    }


def start_audit(domain: str) -> dict:
    audit_id = f"audit-{domain.replace('.', '-') }"
    AUDIT_REPORTS.setdefault(
        audit_id,
        {
            "domain": domain,
            "status": "pågår",
            "started_at": datetime.utcnow().isoformat() + "Z",
            "issues": [],
            "summary": "Audit startad med mockade data",
        },
    )
    return {"audit_id": audit_id, "status": "pågår"}


def get_audit_report(audit_id: str) -> dict | None:
    return AUDIT_REPORTS.get(audit_id)


def backlinks_summary(domain: str) -> dict:
    return BACKLINKS.get(
        domain,
        {
            "total_domains": 0,
            "dofollow": 0,
            "nofollow": 0,
            "tox_score": 0,
            "top_anchors": [],
            "new_links": 0,
            "lost_links": 0,
        },
    )


def generate_content_brief(keyword: str, competitors: List[str], tone: str, cta_type: str) -> dict:
    outline = [
        {"heading": "H1", "text": f"Allt du behöver veta om {keyword}"},
        {"heading": "H2", "text": "Fördelar och vetenskap"},
        {"heading": "H2", "text": "Dosering och säkerhet"},
        {"heading": "H3", "text": "Vanliga frågor från svenska kunder"},
    ]
    entities = ["ashwagandha", "adaptogener", "stress", "sömn"] if "ashwagandha" in keyword else ["vitamin C", "immunförsvar"]
    return {
        "keyword": keyword,
        "tone": tone,
        "cta": cta_type,
        "competitors": competitors,
        "outline": outline,
        "recommended_entities": entities,
        "meta_description": f"Lär dig mer om {keyword} och hur svenska varumärken positionerar sig.",
    }


def local_keywords(region: str, query: str | None) -> List[dict]:
    items = LOCAL_KEYWORDS.get(region.lower(), [])
    if query:
        return [item for item in items if query.lower() in item["keyword"]]
    return items


def list_projects() -> List[dict]:
    return PROJECTS


def create_project(project: dict) -> dict:
    project["id"] = project.get("id", f"proj-{len(PROJECTS) + 1}")
    project.setdefault("created_at", datetime.utcnow().isoformat() + "Z")
    PROJECTS.append(project)
    return project

