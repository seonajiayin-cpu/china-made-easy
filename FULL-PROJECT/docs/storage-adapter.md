# Storage Adapter v1

## Current mode

China Made Easy remains local-first and guest-friendly. `CMEStorage` is a synchronous wrapper around browser `localStorage`, allowing UI/data code to use one storage contract rather than calling the browser API directly. Cloud mode is disabled and no backend credentials are configured.

## Contract

- `getItem(key)` returns a string or `null` when unavailable.
- `setItem(key, value)` returns `true` on success and `false` on failure.
- `removeItem(key)` returns `true` on success and `false` on failure.
- `getJSON(key, fallback)` safely parses JSON.
- `setJSON(key, value)` serializes JSON and reports success.
- `getStatus()` exposes the current storage mode for the UI.
- `sync()` intentionally throws while cloud sync is not configured.

## Migration principles

1. Preserve existing key names to avoid breaking users' saved prototype data.
2. Never silently clear local records when backend mode is introduced.
3. Guest data migration must be explicit and reversible until server confirmation.
4. Cloud writes must be authenticated and protected by RLS.
5. Conflict resolution must preserve the newest valid record and report unresolved conflicts.
6. Backend secrets must never be shipped to the browser.

## Future provider interface

A future provider may implement asynchronous `get`, `set`, `remove`, `sync`, and authenticated identity methods. The present UI is synchronous, so the cloud adapter must be introduced behind a compatibility layer or a deliberate async migration—not enabled by flipping the current flag.
