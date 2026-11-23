# Phase 17 — Modular foundation

## Goal
Begin a safe transition from the standalone HTML prototype toward maintainable modules without breaking the offline preview.

## Added modules
- `src/core/trip-schema.js`: schema v4 normalization, migration entry point, and validation.
- `src/core/storage-adapter.js`: injectable Storage-compatible adapter with JSON helpers.
- `src/planner/constraints.js`: pin/day-lock helpers, flexible-slot enumeration, and protected-slot summary.
- `src/package.json`: marks the source foundation as ES modules.

## Migration boundary
The existing `index.html` and `preview.html` remain the production prototype and are not yet wired to import these modules. This is intentional: local-file preview compatibility and the existing embedded application are preserved. These modules establish a testable source-of-truth foundation for the next staged extraction. Avoid claiming the UI now runs modular code until integration/build tooling is completed.

## Validation
Run `node scripts/validate-modular-foundation-phase-17.js`. The validator performs static checks and runtime smoke tests for schema normalization, constraint preservation, and storage JSON round-trip.

## Next
Phase 18 should add a deterministic build/assembly step and migrate one low-risk feature into modules, with generated standalone HTML and regression checks. Then progressively replace embedded implementations rather than duplicating logic indefinitely.
