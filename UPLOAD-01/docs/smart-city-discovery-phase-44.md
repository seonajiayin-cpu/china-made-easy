# Phase 44 — Smart City Discovery

## Purpose
Extend personalization from attraction ranking within a city to destination discovery across the supported city catalog.

## User flow
1. Choose trip length (3, 5, 7, 10, 14 or 21+ days).
2. The discovery panel reads the saved Traveler Profile locally.
3. It ranks supported cities using available city themes, trip-length fit, interests and a small set of profile signals.
4. It presents city matches and route concepts.
5. `Plan this city` selects a destination and a supported planner duration, then scrolls to the single-city Trip Planner. The user still generates the itinerary explicitly.

## Route concepts
- Classic first-time China: Beijing + Shanghai
- Southern city pair: Guangzhou + Shenzhen
- Southwest city pair: Chengdu + Chongqing
- Xinjiang landscape trip: Xinjiang as a geographic cluster
- Northeast winter / architecture: Harbin

These are content-based concepts only. No live rail, flight, transfer time, prices, seasonal access, permits, booking or entry information is queried. The panel discloses this limitation.

## Scoring
- Interest themes mapped to city metadata.
- Match contributes up to 6 points per selected interest, depending on theme hits.
- Profile signals: photography-focused, avoid crowds, budget, family group.
- Suggested stay fit adds or subtracts points.
- Results are relative ranking, not suitability claims.

## Data safety
No profile data is transmitted. The profile is read from local storage. Missing city data is treated as unknown.

## Limitations
The city metadata is a manually authored, compact discovery index based on the project's current city catalog. Multi-city suggestions are not executable routes. The planner currently operates one city at a time.
