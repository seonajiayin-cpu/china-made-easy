# China Made Easy Sync Engine Foundation v1

## Current behavior
- All user data remains local-first in browser storage.
- Every CMEStorage write/removal (except sync metadata) records a pending mutation by key.
- Metadata includes a device ID, pending operations, conflict records, and a last-synced timestamp field.
- `createSnapshot()` packages pending keys for a future provider adapter.
- `mergeSnapshot()` applies remote records only when no local pending mutation exists; overlapping keys are recorded as manual-review conflicts rather than silently overwritten.
- `sync()` intentionally rejects because no backend/provider is configured.

## Safety limitations
This is a synchronization foundation, not a live sync implementation. Pending changes are not uploaded, last-synced is not updated, and conflict resolution is not exposed in the UI. Device IDs are pseudonymous local identifiers, not authentication. Snapshot format is internal and should be versioned before a cloud API is introduced.

## Next implementation gates
1. Connect a test Supabase project and authenticated user.
2. Define server-side record ownership and provider API contract.
3. Upload/download snapshots with retry and idempotency.
4. Implement explicit conflict review and merge UI.
5. Guest-to-account migration with backup and rollback.
6. Test offline, multi-device, sign-out, account deletion, and RLS isolation.
