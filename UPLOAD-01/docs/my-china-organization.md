# My China organization

The personal travel centre is organized into four collapsible groups:

1. **My Journey & travel record** — city check-ins, attraction check-ins, and journey timeline.
2. **Achievements** — city, attraction, and experience badges.
3. **Traveler profile** — optional display name, home region, and travel style, stored locally.
4. **Privacy & data management** — local-only disclosure, export/backup, import, migration preview, and deletion controls.

Existing DOM IDs and handlers are retained to preserve current functionality. The group layout is a presentation change, not a new account or cloud-sync feature. The default expanded group is My Journey; the other groups are collapsed.

Validation: `scripts/validate-my-china-organization.js` checks the four groups, key controls, and local-storage disclosure.
