# Phase 15 — Trip Autosave & Versioning

## Implemented
- Local-only draft autosave after itinerary history commits, with a short debounce.
- Draft recovery prompt on startup when a draft is newer than the latest saved trip.
- Draft payload includes city, days, style, name, slots, locks, pins and current saved-trip ID.
- Manual version snapshots for saved trips; up to 20 recent snapshots per trip.
- Restore a version into the active editable itinerary.
- Autosave status indicator in the planner.

## Storage
- Draft: `cme-planner-draft-v1`
- Version snapshots: `cme-trip-versions-v1`
- Existing saved-trip library remains local-only.

## Limitations
- No cloud sync or cross-device recovery.
- Draft recovery is prompted, not silently applied.
- Version snapshots are local browser storage and limited to 20 per trip.
- Browser storage can be cleared by the user or browser policies.
