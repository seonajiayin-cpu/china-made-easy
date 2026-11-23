# China Made Easy — Product Roadmap & Agreed Scope

This document consolidates previously discussed and accepted product direction. It is the working scope—not a replacement brainstorm.

## Product promise
**China Made Easy** — *Explore China. Travel with Confidence.* Help international visitors prepare, navigate, experience and enjoy China through friendly, practical guidance and a growing travel-service ecosystem.

## Brand / UX decisions
- Forest green `#254D38`; warm cream; mobile-first.
- Primary mark: a simple open `C` integrated with an upper-right arrow; white mark on forest green. Avoid complex panda/Great Wall elements in the logo. Panda Guide remains a friendly illustration/mascot elsewhere.
- Simple English; short sentences; visual-first and low cognitive load.
- Step-by-step guides: one action at a time, progress, Back, completion and ability to return.
- Keep core travel/survival guidance free. Do not paywall essential safety or practical information.
- Early product should avoid heavy advertising.
- Content must be accurate, maintained and clearly distinguish stable guidance from dynamic facts.

## Main product navigation (target mini-program)
1. **Home** — onboarding, search, popular tasks, current trip, recommended next steps.
2. **Explore** — destinations, city guides, attractions, food, neighbourhoods and experiences.
3. **Essentials** — payment, connectivity, apps, transport, railway, food ordering, hotels, entry preparation, safety and survival.
4. **Guide** — contextual step-by-step tutorials and quick help.
5. **My Trip** — itinerary, checklist, saved places, bookings, trip notes and personal progress.

The current website prototype may use a different navigation implementation while these product areas are progressively delivered.

## Agreed core free content
- Payments: Alipay / WeChat Pay setup, QR payment, troubleshooting and backup methods.
- Transport: metro, taxi / DiDi, public transport, high-speed rail and station procedures.
- Connectivity and essential apps.
- Food and dining: ordering, menus, dietary communication and useful phrases.
- Hotels and accommodation basics.
- Entry/document preparation, packing and safety/emergency information.
- City and destination guides, attractions, regional food and practical tips.
- Survival phrasebook / communication aids.
- Checklist and trip-planning basics.

## Explore China / destination content
- City overview, best length of stay, highlights, attraction detail, neighbourhoods, food, suggested routes, practical tips and links to official sources.
- Build toward a consistent content model, multilingual content (EN/FR/ES discussed), source review metadata, and independent attraction SEO pages.
- Dynamic facts such as tickets, opening hours, booking rules, schedules and entry requirements must carry verification dates and be rechecked before travel.

## Experience China (accepted brainstorm)
- Mahjong
- KTV / karaoke
- Massage and foot massage
- Hot pot
- Tea culture / tea houses
- Bathhouses / spa / sauna
- Sports and local activities
- Night markets
- Cooking classes
- Traditional activities and cultural workshops (e.g. calligraphy, crafts, opera, hanfu)

This area should help visitors discover and understand experiences, then later connect to vetted providers or booking services. Do not imply that CME currently books or endorses a provider without verification.

## My China (accepted brainstorm)
- Personal China map / destination progress concept.
- City check-ins.
- Achievements / badges.
- Rewards and loyalty.
- Saved trip, itinerary, checklist, places and quick access.
- Later account-based sync across devices; current prototype is local-only.

## Feedback loop
- A **Suggest a Feature** action should be visible and easy to use.
- Collect ideas by category and make clear whether they are actually sent. Prototype can save locally and offer copy/share; production requires a backend or defined contact channel.
- “We're Just Getting Started!” approved messaging.

## Services / commercial ecosystem discussed
- Future paid trip-planning, booking assistance and China Made Easy services.
- Experience Buddy / local experience support.
- Partner and affiliate/referral opportunities, subject to transparent disclosure and provider review.
- AI-assisted trip planning and contextual help as a later phase.
- Future business/service partnerships; not to be represented as live until implemented.

## Accepted loyalty concept
After **10 paid China Made Easy services**, the **next 5 China Made Easy services** have their **CME service fees waived**. Third-party costs remain payable. This must be stated clearly; it is not a blanket free-booking promise. A production implementation needs account identity, paid-service records, redemption rules, fraud prevention, terms and support workflows.

## Technical direction discussed
- Native WeChat Mini Program + cloud development as the target app direction.
- Content-first data model and reusable components.
- Website remains an accessible public discovery/content channel and can share structured content.
- Future AI, service booking, loyalty and partner integration should be modular—not hardcoded into one page.

## Development sequence
1. Preserve the existing live prototype and make a safe working copy.
2. Implement accepted, low-risk front-end features in the current site: Experience China, Suggest a Feature, My China check-ins and achievements.
3. Establish shared content models and migrate city/attraction data from HTML.
4. QA existing and new interactions, responsive layout, accessibility and storage behaviour.
5. Expand destination content and verified source records.
6. Add licensed photography and SEO-friendly destination/attraction pages.
7. Design the Mini Program architecture and cloud data model.
8. Add account sync, booking/service operations, partner flows, AI, loyalty and monetisation only when the required backend, policies and support are ready.

## Current implementation caveats
- Suggestion collection and check-ins are local to the device/browser; suggestions are not sent to the project team.
- No booking, payment, provider verification or loyalty redemption is connected.
- Achievements are prototype badges based on locally recorded city check-ins.
- The current public site is a prototype; this package has not been deployed.
