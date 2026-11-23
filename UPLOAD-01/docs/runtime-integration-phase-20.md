# Phase 20 — Runtime Repository Integration

## Integrated operations
- Saved-trip list and read: repository API
- Save trip: repository API and latest-saved compatibility key
- Delete trip: repository API, including associated version history
- Draft autosave and recovery: repository API
- Manual version save and restore: repository API
- Version history cap: 20

## Architecture note
The standalone HTML runtime uses a browser-compatible bridge (`src/core/trip-repository-runtime.js`) injected into `index.html` by this phase. It mirrors the repository contract and uses the same legacy localStorage keys. The ESM repository remains separately unit-tested. This avoids requiring a network server or bundler for the single-file preview.

## Data compatibility
Existing keys remain: `cme-saved-trips-v1`, `cme-saved-trip-v1`, `cme-planner-draft-v1`, and `cme-trip-versions-v1`.
