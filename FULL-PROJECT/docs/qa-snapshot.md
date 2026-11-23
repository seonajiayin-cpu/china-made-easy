# QA snapshot — 22 November 2026

## Checks completed
- HTML parser: PASS
- Inline JavaScript syntax (`node --check`, all 4 script blocks): PASS
- Attraction model and schema JSON parse: PASS
- Dependency-free content validator: PASS
- Required model fields and key enums: PASS
- Local My China data controls added: export and clear check-ins
- Legacy city-checkin migration: string entries convert to structured records

## Not yet tested
- Real browser rendering and responsive behavior
- Modal, buttons and storage flows in a browser
- Accessibility audit / keyboard flow / screen reader
- External links and live dynamic travel details
- Cloud deployment

## Current limitation
No browser automation runtime (Playwright, Puppeteer or jsdom) is installed in this environment. Static validation is not a substitute for browser QA.

## Next priority
1. Migrate attraction records from HTML into structured JSON and build a data-loading layer.
2. Add city content records and source metadata.
3. Browser QA once a browser runtime is available.
4. Review accessibility and mobile interactions.
- Structured attraction extraction: PASS — 34 records / 8 destination IDs / 34 unique IDs
- JSON-first attraction browser loader: added with embedded fallback; static syntax checked, browser runtime still untested

## Latest continuation update — 22 Nov 2026

- Added `data/cities.json` as the authoritative city registry (8 cities).
- Updated the attraction JSON loader to fetch both city and attraction records and resolve `cityId` through the registry instead of a duplicated hard-coded map.
- Extended `scripts/validate-content.js` to validate city records, duplicate city IDs, duplicate attraction slugs, and attraction-to-city references.
- Validation result: 8 cities, 34 attractions, 34 unique IDs, 34 unique slugs; content validation passes.
- All inline JavaScript blocks in `index.html` pass `node --check`.
- Browser interaction and deployment remain untested.


## Localization foundation (next development round)
- Supported locale scaffolding: en, zh-Hans, zh-Hant, fr.
- Language selector stores preference locally.
- City Snapshot and attraction-guide interface labels have initial translations.
- City names localized for the 8 current destinations.
- Full site/content translation is not complete; English fallback remains.
- Locale model file: `data/locales.json`.

## Latest development round — Trip Planner data integration
- Trip Planner now reads the loaded attraction records for a city and uses those names as itinerary suggestions when at least three records are available.
- Legacy city route suggestions remain as fallback if structured attraction data is unavailable.
- Generated attraction names and localized city headings are HTML-escaped before rendering.
- Planner remains a prototype: no live routing, opening-hours validation, booking integration, geographic optimization, or server-side AI generation.
- Validation: 8 city records and 34 attraction records pass the content validator; all 4 inline JavaScript blocks pass `node --check`.

## Latest development round — My China attraction check-ins
- Added attraction check-in controls linked to the JSON attraction records.
- Visitors can choose a city, select an attraction, and save a local check-in with a timestamp.
- Added attraction check-in display and two new achievements (3 attractions / 10 attractions).
- Export now includes attraction check-ins; users can clear attraction check-ins separately.
- Attraction records are loaded at initialization; selector is populated after successful JSON load.
- Static content validation: PASS (8 cities, 34 attractions).
- Inline JavaScript syntax check: PASS (4 blocks).
- Browser UI / localStorage interaction testing: NOT YET TESTED.


## Experience data migration
- Added `data/experiences.json` with 10 structured experience categories.
- Experience cards and detail modals read from the JSON file, with embedded English fallback.
- Localized names/descriptions are available for 7 configured locales; detailed guide content is currently English with a Simplified Chinese field and English fallback.
- Experience data is validated for required fields, duplicate IDs, slug format and content status.
- Booking status is explicitly `not-bookable`; no provider or availability claims are made.


## Experience associations and favorites
- Experience records now contain `recommendedCityIds`; validator checks references against `cities.json`.
- UI supports experience favorites stored in localStorage and renders a favorites section.
- Favorites are device-local; no account sync/backend is implemented.
- Browser interaction testing remains outstanding.


## Latest round
- Experience check-ins added to local My China records.
- Combined Journey Timeline renders city, attraction and experience records in descending date order.
- Experience achievements added: 3 and 5 check-ins.
- Clear experience check-ins control added.
- Content validator: PASS. Inline JavaScript syntax: PASS. Browser/mobile interaction QA: NOT RUN.

## Latest development round — My China data portability v2
- Export format now versioned and includes trip, city/attraction/experience check-ins, favorites, suggestions, app/pre-trip checklist state and locale.
- Added import control for compatible JSON exports; replacement requires confirmation.
- Added reset-all-local-data control with confirmation.
- Checklist controls are restored after import/reset.
- Static content validation: PASS (10 experiences, 8 cities, 34 attractions).
- Inline JavaScript syntax: PASS (4 blocks).
- Browser interaction, file import/export and mobile QA: NOT YET TESTED.
