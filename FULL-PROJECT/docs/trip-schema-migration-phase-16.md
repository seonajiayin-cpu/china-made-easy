# Phase 16 — Versioned Trip Schema & Migration Foundation

## Goal
Introduce a canonical, versioned local trip shape to make saved trips, drafts, and version snapshots easier to migrate and eventually synchronize across devices.

## Current schema
- `schemaVersion: 4`
- `city` string
- `days` integer clamped to 1–30
- `style` string (defaults to `balanced`)
- `slots`: one normalized object per day with `morning`, `afternoon`, `evening` string fields
- `dayLocks`: boolean array aligned with `slots`
- `pinnedSlots`: unique strings in `dayIndex:slotName` form, limited to valid day indices and supported slots
- timestamps and other metadata are preserved when present

## Migration behavior
A normalization/migration helper is used when reading saved trips, version histories, and recoverable drafts. Legacy/missing schema versions are upgraded in memory to v4; malformed slot values become empty strings, invalid pin keys are discarded, and lock arrays are padded/truncated to the itinerary length. Day count is bounded to 30.

## Scope and limitations
- This is a local data-shape foundation, not a cloud sync implementation.
- Reads normalize legacy records in memory; migration is not automatically persisted until the relevant record is saved again.
- Existing storage keys remain unchanged to avoid a risky destructive migration.
- The app remains a single HTML prototype; this phase does not extract runtime modules.

## Validation
Run `node scripts/validate-trip-schema-phase-16.js` and the full validator suite. Check embedded JavaScript syntax in both `index.html` and `preview.html`.
