from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_keywords_search_returns_result():
    response = client.post("/keywords/search", json={"query": "ashwagandha"})
    assert response.status_code == 200
    data = response.json()
    assert data
    assert data[0]["keyword"].startswith("ashwagandha")
    assert "kd_se" in data[0]


def test_audit_lifecycle():
    start = client.post("/audit/start", json={"domain": "scandicwellness.se"})
    assert start.status_code == 202
    audit_id = start.json()["audit_id"]

    report = client.get(f"/audit/report/{audit_id}")
    assert report.status_code == 200
    issues = report.json().get("issues")
    assert isinstance(issues, list)


def test_content_brief_generation():
    response = client.post(
        "/content/brief",
        json={
            "keyword": "ashwagandha gummies",
            "competitors": ["apoteket.se"],
            "tone": "Varm och rådgivande",
            "cta_type": "Köp nu",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["keyword"] == "ashwagandha gummies"
    assert "outline" in body


