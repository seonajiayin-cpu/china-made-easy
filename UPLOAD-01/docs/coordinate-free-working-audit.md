# Coordinate-free cleanup — release 0.1.137

## Scope

- Attraction data and schema contain no GPS coordinate properties.
- Inline `index.html` and externalized planner source scripts are synchronized.
- GPS/distance functions, geographic clustering, coordinate route plotting, and distance-based alternative scoring were removed or replaced with address-first/manual-order behavior.
- Manual stop reorder, time-slot assignment, day moves, booking/readiness checks, visit-duration estimates, and saved itinerary flows remain.
- Travel/transfer time is explicitly not calculated.

## Static scan

| Pattern | Count in source files |
|---|---:|
| `\blatitude\b` | 0 |
| `\blongitude\b` | 0 |
| `plannerDistanceKm` | 0 |
| `geographicClusters` | 0 |
| `haversine` | 0 |

Source files scanned: `index.html`, `assets/js/phase82-planner-quality.js`, `assets/js/phase97-optimization-workflow.js`.

## Address audit



Release candidate: **0.1.137**

- Attraction records: **52**
- Records with at least one address field: **52/52**
- Missing both address fields: **0**
- Missing Chinese address: **0**
- Coordinate properties in attraction records: **0**

## Address exceptions

No attraction record is missing both address fields. Area-level references are retained where a destination is a district, village, lake, or scenic area; these are not fabricated street addresses.
