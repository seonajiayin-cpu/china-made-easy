# Multi-trip Library v1

Trip Planner can now save multiple itinerary snapshots on the current device under `cme-saved-trips-v1`. Each snapshot has an ID, name, city, day count, travel style, editable day slots, and saved timestamp. Users can load or delete individual plans. The legacy `cme-saved-trip-v1` key remains as a compatibility/current-trip summary.

This is local-only storage. It is not cloud backup or account sync. Saving a loaded trip creates a new snapshot rather than silently overwriting the original.
