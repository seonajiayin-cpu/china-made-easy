# Phase 39 — Visual Itinerary & Travel Calendar

## Delivered
- Adds a visual overview before the editable itinerary slots.
- Each day is shown as a card with Morning, Afternoon, and Evening.
- Empty slots are explicitly presented as flexible time.
- Shows activity count, existing planner load level, and a rough activity-hours estimate.
- Flags days marked heavy by the existing planner quality heuristic.
- Adds Timeline and Calendar layout controls; calendar layout uses a compact responsive grid.
- Preserves the existing editable text slots, day locks, pinned slots, planner quality report, save/autosave, and print flow.

## Limitations
- Hours are heuristic estimates based on activity counts and time slots, not venue duration or route travel time.
- Geographic route and opening-hour verification remain separate planning steps.

## Validation
Run `node scripts/validate-visual-itinerary-phase-39.cjs`, `node --test tests/*.test.mjs`, and `node scripts/build-preview.mjs`.
