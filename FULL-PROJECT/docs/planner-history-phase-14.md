# Phase 14 — Planner Undo / Redo and History

## Added
- Snapshot-based undo and redo for itinerary edits.
- Snapshot includes city, travel style, day slots, day locks, and pinned slots.
- Undo/Redo controls and a compact history position/label indicator.
- Branching: after undo, a new edit discards the redo branch.
- History is capped at 30 snapshots; oldest snapshots are dropped.
- Loading or generating a trip starts a fresh history baseline.
- Duplicate snapshots are skipped.

## Scope and limitations
- Slot text changes are recorded on input; undo can step through text edits.
- History is in-memory for the current editing session and is not persisted across reloads.
- History does not include report-panel text or saved-trip library operations (save/delete).
- Snapshot restoration rerenders the planner and restores day-lock and pin metadata.
