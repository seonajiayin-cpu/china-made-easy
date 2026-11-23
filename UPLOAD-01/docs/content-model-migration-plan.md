# Content model migration plan

## Why
Avoid editing destination and attraction content directly in the monolithic HTML. Structured records allow consistent content, multilingual expansion, source review, reusable cards/details and future SEO pages.

## First record type: Attraction
The canonical model and JSON Schema live in:
- `data/attraction-content-model.example.json`
- `data/schema/attraction.schema.json`

## Required content discipline
- Stable `id`, `slug`, `cityId`
- Localized `names` and summaries
- Category and optional duration/highlights/tips
- Ticket and opening-hours verification status, dates, and official links
- GPS coordinates are excluded from the attraction content model
- Image license and credit metadata for every image
- Source records with type and checked date
- `contentStatus`: draft, needs-review or published

## Migration sequence
1. Inventory existing HTML city/attraction data and identify duplicates.
2. Convert one destination (Beijing pilot) into JSON records.
3. Validate records against schema and run the dependency-free validator.
4. Build a read-only data layer and compare rendered output with current prototype.
5. Migrate remaining destinations incrementally, preserving existing UI behavior.
6. Only after parity, remove duplicated hardcoded content.

## Current state
Schema and example record exist; full migration and rendering integration have not yet begun.

## Migration progress — first extraction
- Extracted the existing attraction entries from the prototype into `data/attractions.json`.
- 34 records across 8 destinations; 34 unique IDs.
- Each record preserves the current English description, Chinese name, visitor tip and suggested visit duration.
- Six Beijing attraction records carry official visitor-source links and `needs-review` status; other entries remain `draft` / `unverified` rather than being presented as verified.
- City attraction browser now attempts to load the structured JSON first and falls back to the embedded data if the request fails.
- This is a data extraction and UI parity step, not a completed source audit or full HTML content migration.
