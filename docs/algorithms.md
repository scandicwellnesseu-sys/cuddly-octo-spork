# Algoritmer & Beräkningslogik

## Keyword Difficulty (KD_SE)
```python
def calculate_kd_se(mean_domain_authority: float, backlink_strength: float, serp_volume_weight: float) -> float:
    """Beräknar svensk keyword difficulty genom att normalisera på 0-100."""
    kd = (mean_domain_authority + backlink_strength + serp_volume_weight) / 3
    return round(min(max(kd, 0), 100), 2)
```
- **mean_domain_authority:** Genomsnittligt DA för topp-10-resultat (skalat 0-100).
- **backlink_strength:** Normaliserad länkstyrka baserad på referring domains och relevans.
- **serp_volume_weight:** Viktning av SERP-variabilitet (antal features, historiska hopp).

## Synlighetsindex (SE)
```python
def calculate_visibility(positions: list[tuple[int, int]]) -> float:
    """positions: lista av (position, volym)."""
    weights = {1: 1.0, 2: 0.8, 3: 0.6, 4: 0.5, 5: 0.4, 6: 0.35, 7: 0.3, 8: 0.25, 9: 0.2, 10: 0.15}
    numerator = sum(weights.get(pos, 0.1) * volume for pos, volume in positions)
    denominator = sum(volume for _, volume in positions) or 1
    return round(numerator / denominator, 3)
```

## Audit Prioritet
```python
def calculate_priority(traffic_impact: float, success_probability: float, effort: float) -> float:
    if effort == 0:
        return traffic_impact * success_probability * 1.5
    return round((traffic_impact * success_probability) / effort, 2)
```
- **traffic_impact:** Procentuellt estimat av trafikförlust/vinst (0-1).
- **success_probability:** Sannolikhet att åtgärden lyckas (0-1).
- **effort:** Relativ arbetsinsats (1 = 1 dag).

## Tox-score
```python
def calculate_tox_score(anchor_text: str, tld: str, domain_trust: float, spam_signals: int) -> float:
    risky_anchor = 20 if anchor_text.isupper() or "gratis" in anchor_text.lower() else 0
    tld_penalty = 15 if tld in {".xyz", ".info"} else 0
    trust_penalty = max(0, 50 - domain_trust)
    spam_penalty = spam_signals * 5
    score = min(100, risky_anchor + tld_penalty + trust_penalty + spam_penalty)
    return round(score, 1)
```

## AI Keyword Clustering (V2)
- Normalisera sökord via svensk stemming och lemmatisering.
- Beräkna TF-IDF-matris och reducera med PCA → K-means.
- Använd silhouette score för att välja optimalt antal kluster.

## AI Content Optimization Engine (V2)
- Bygger feature-matris med entiteter, läsbarhetsindex (LIX), sentiment och SERP-coverage.
- Beräkna score = viktad summa mot top-3 i SERP.
- Återkoppla rekommendationer (saknade entiteter, rubrikstruktur).

## Auto SEO Insights (V2)
- Cron-jobb analyserar `serp_snapshots` och Google Search Console-data.
- Trigger notifiering vid >15% tapp i synlighet eller stor positionsförändring.

