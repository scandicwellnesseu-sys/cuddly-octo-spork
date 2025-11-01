"""Gemensamma beräkningsfunktioner."""
from __future__ import annotations


def calculate_kd_se(mean_domain_authority: float, backlink_strength: float, serp_volume_weight: float) -> float:
    kd = (mean_domain_authority + backlink_strength + serp_volume_weight) / 3
    return round(min(max(kd, 0), 100), 2)


def calculate_visibility(positions: list[tuple[int, int]]) -> float:
    weights = {1: 1.0, 2: 0.8, 3: 0.6, 4: 0.5, 5: 0.4, 6: 0.35, 7: 0.3, 8: 0.25, 9: 0.2, 10: 0.15}
    numerator = sum(weights.get(pos, 0.1) * volume for pos, volume in positions)
    denominator = sum(volume for _, volume in positions) or 1
    return round(numerator / denominator, 3)


def calculate_priority(traffic_impact: float, success_probability: float, effort: float) -> float:
    if effort == 0:
        return round(traffic_impact * success_probability * 1.5, 2)
    return round((traffic_impact * success_probability) / effort, 2)


def calculate_tox_score(anchor_text: str, tld: str, domain_trust: float, spam_signals: int) -> float:
    risky_anchor = 20 if anchor_text.isupper() or "gratis" in anchor_text.lower() else 0
    tld_penalty = 15 if tld in {".xyz", ".info"} else 0
    trust_penalty = max(0, 50 - domain_trust)
    spam_penalty = spam_signals * 5
    score = min(100, risky_anchor + tld_penalty + trust_penalty + spam_penalty)
    return round(score, 1)

