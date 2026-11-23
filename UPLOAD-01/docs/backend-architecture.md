# Backend & account architecture — planning contract

## Current status
The website remains a static prototype. There is no authentication provider, database, API, cloud sync, or server-side account management connected. `data/backend-config.example.json` is a disabled example configuration, not credentials.

## Recommended first backend
Use Supabase (Postgres + Auth + Row Level Security) as a proposed provider, subject to cost, hosting-region, privacy, and product review. Keep the frontend provider-agnostic behind a small data adapter.

## Account modes
1. **Guest mode**: current browser-local functionality. No account required.
2. **Email account**: email magic-link or passwordless sign-in; avoid collecting passwords in CME itself.
3. **Account migration**: user explicitly chooses to upload/import guest data after sign-in. Never silently overwrite cloud records.

## Proposed entities
- `profiles`: user ID, display name (optional), preferred locale, timestamps, consent version, deletion state.
- `trips`: owner ID, title, city IDs, dates (optional), itinerary JSON, timestamps.
- `city_checkins`: owner ID, city ID, visited timestamp.
- `attraction_checkins`: owner ID, attraction ID, city ID, visited timestamp, optional note.
- `experience_checkins`: owner ID, experience ID, city ID, visited timestamp, optional note.
- `experience_favorites`: owner ID, experience ID, created timestamp.
- `checklist_progress`: owner ID, checklist key, item key, checked state, updated timestamp.
- `feature_suggestions`: owner ID (nullable for guest submission if enabled), category, text, status, timestamps.

## Security requirements
- Enable Row Level Security on every user-owned table.
- Every user can select, insert, update, and delete only rows whose `user_id` matches the authenticated UID.
- Never put a service-role key in browser code or static files.
- Validate IDs against public content tables; enforce length limits on notes and suggestions.
- Use rate limiting / abuse controls for public suggestion endpoints.
- Do not store passport, payment-card, or sensitive identity information in travel profile data.
- Support data export and account deletion; deletion should have a clear confirmation and documented retention behavior.

## Migration flow
1. Keep guest data local and continue supporting the current export format.
2. Sign in / create account.
3. Show a migration preview: counts of trips, check-ins, favorites, checklist items and suggestions.
4. Ask explicit confirmation to merge.
5. Upload idempotently using stable IDs; avoid duplicate check-ins.
6. Verify cloud data counts and allow the user to retain or clear local data.
7. If migration fails, preserve local data and offer retry.

## API / adapter boundary
Implement a `CMEDataAdapter` with methods such as `getProfile`, `saveTrip`, `listCheckins`, `addCheckin`, `removeCheckin`, `listFavorites`, `toggleFavorite`, `getChecklist`, `saveChecklist`, `exportUserData`, and `deleteAccount`. A local adapter should remain the default until a backend is configured. A remote adapter must not be activated by merely setting an example URL.

## Next implementation milestones
- [ ] Decide provider and hosting region after privacy/cost review.
- [ ] Create project and environment variables outside the repository.
- [ ] Implement authentication UI and adapter.
- [ ] Create SQL migrations and RLS policies.
- [ ] Add guest-to-account migration.
- [ ] Add cloud sync status, conflict handling and offline queue.
- [ ] Test security, account deletion, export and recovery.

## Supabase SQL migration draft

A first SQL migration draft is available at `supabase/migrations/202611220001_initial_user_data.sql`. It creates profiles, trips, city/attraction/experience check-ins, favorites, checklist progress and suggestions, adds indexes and a new-user profile trigger, and enables RLS with owner-scoped policies. It is a reviewable draft only: it has not been applied to a Supabase project, executed against Postgres, or subjected to security testing. Public/anonymous suggestion submission is intentionally not enabled in this migration.

Run `node scripts/validate-supabase-migration.js` for static contract checks. This check does not prove SQL validity or policy security.
