# Phase 12 — Pinned Itinerary Editing

## Added
- Lock/unlock a whole day to protect its text fields from manual editing and day removal.
- Pin/unpin an individual morning, afternoon, or evening slot to protect it from manual editing.
- Saved trips persist `dayLocks` and `pinnedSlots`; older saved trips remain loadable with default unlocked state.
- Day movement updates lock state and pin indices; locked days cannot be moved or removed.
- Automatic distribution functions refuse to run while any day is locked or any slot is pinned, preventing accidental overwrite.

## Scope / limitations
- This is local-device itinerary protection, not collaboration or cloud sync.
- Pins protect exact text slots. They are not yet attraction identity constraints for a route optimizer.
- Users must unlock/unpin before running automatic distribution; the algorithm does not yet optimize around protected slots.
- Manual edits and lock/pin metadata are saved only when the user saves a trip.
