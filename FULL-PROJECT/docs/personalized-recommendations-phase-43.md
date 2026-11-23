# Phase 43 — Personalized Recommendations Engine

## Goal
Use the local traveler profile to rank attraction recommendations and improve planner ordering. No account or cloud data is required.

## Scoring inputs
- Selected interests: keyword matches in available attraction names, category, theme, English summary, highlights and visitor tips.
- Avoid crowds: signals from available text; crowd claims are not inferred when data is absent.
- Photography: view, scenic, panorama, skyline, sunset and night-view terms.
- Family-friendly / accessibility: only explicit descriptive signals increase a score. Lack of signals is unknown, not a negative assessment.
- Budget: only known ticket prices affect budget ranking. Unknown prices remain neutral.

## UI
City attraction browser shows up to three preference-based picks when a profile is configured. Picks open the attraction guide. Topic browsing remains available and the full list is not filtered out.

## Limitations
This is a transparent keyword-scoring prototype, not a machine-learning model or verified suitability database. It does not establish dietary suitability, accessibility, family suitability, crowd levels, opening hours, live prices, or bookings. Scores use currently available content and can be improved by richer structured content metadata.
