# Guest Profile & Preferences v1

## Status
Implemented in the static prototype. This is a local-only profile/preferences panel, not an authenticated account.

## Stored fields
- `displayName` (optional, max 60 characters)
- `homeRegion` (optional, max 80 characters)
- `travelStyle` (one of culture, food, nature, relaxed, budget, family)
- `updatedAt`

## Privacy and behavior
- Stored under `cme-guest-profile-v1` in browser local storage.
- No email, password, passport, precise location, or sensitive identity data is requested.
- No profile data is uploaded.
- Profile preferences are included in My China JSON export and restored from a compatible import.
- Reset All My China Data removes the guest profile.
- The account-migration preview reports whether profile preferences exist, but does not upload or delete them.

## Future account requirements
When real authentication is introduced, provide a clear preview, explicit consent, backup, migration verification, and a way to edit or delete the profile. Never treat guest profile data as an authenticated identity.
