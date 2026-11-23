# Issue Repair — v0.1.138

## Repairs completed
- Aligned the legacy city `status` field with the authoritative `contentStatus` value for nine cities. All nine had `status: published` but `contentStatus: needs-review`; they now consistently use `needs-review`. The app displays `contentStatus` and does not filter city content by the legacy `status` field.
- Corrected the information-architecture validator: ID and fragment scans now exclude JavaScript and CSS source blocks, preventing dynamic template/print-window strings from being misreported as active static DOM IDs.
- Static DOM ID scan: 178 IDs, 178 unique, 0 duplicates.
- Updated content-integrity audit after status repair: 707 findings reduced to 698.

## Verification
- Module tests: 21/21 passed.
- Localization: 6/6 passed.
- Content duplicate validator: 8/8 passed.
- Information architecture: 13/13 passed; static DOM duplicate ID scan: 0.
- Preview build and standalone distribution build completed.
- Attraction records: 52; address/addressChinese present on 52/52; coordinate properties: 0.
- Source scan across index, preview, distribution, planner JS modules: latitude 0, longitude 0, plannerDistanceKm 0, geographicClusters 0, haversine 0, distanceKm 0.

## Remaining content-review findings
The audit is structural and does not fact-check. 698 warnings remain: locale coverage, highlights, address verification/source metadata, opening hours and verification dates, ticketing information and verification dates, official booking URLs, images, and source metadata. These cannot be responsibly marked fixed by inventing translations, live details, official links, or image assets. They remain explicitly flagged for source-based review.
