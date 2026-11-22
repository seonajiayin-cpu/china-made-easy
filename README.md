# China Made Easy

China Made Easy is a travel companion prototype for visitors to China. The repository contains the website, structured content, modular source code, validation scripts, tests, documentation, audit reports, and a generated static deployment build.

## Repository structure

- `index.html` — primary website source.
- `assets/` — browser assets, including JavaScript modules used by the generated deployment.
- `data/` — structured city, attraction, experience, localization, schema, and verification data.
- `content/` — content audit records.
- `src/` — modular application and planner source modules.
- `scripts/` — build, audit, and validation scripts.
- `tests/` — automated tests.
- `docs/` — product, content, and development documentation.
- `reports/` and `reports-*.md` — development and QA history.
- `supabase/` — database migration and manual RLS test materials (not currently required for the static prototype).
- `preview.html` — standalone preview generated from `index.html`.
- `dist/` — generated static deployment output.

## Requirements

- Node.js 18 or newer (Node 20 LTS recommended).
- No npm dependencies are currently required by the prototype or its validation tests.

## Build

```bash
npm run build:preview
```

This generates/refreshes `preview.html` and `dist/`. The build externalizes selected JavaScript blocks into `dist/assets/js/` and writes `dist/build-manifest.json`.

## Test

```bash
npm run test:modules
npm run validate:project-integrity
npm run validate:phase120-website
npm run validate:phase121-repair
npm run validate:phase122-website
npm run validate:phase123-visible-code
npm run validate:phase123-lineage
```

Additional historical validation scripts are available in `package.json` and `scripts/`.

## Cloudflare Pages deployment (Git integration)

Recommended settings:

- Framework preset: **None**
- Root directory: `/` (repository root)
- Build command: `npm run build:preview`
- Build output directory: `dist`
- Environment: Node.js 18+ (Node 20 LTS recommended)

Deploy the contents of `dist/`, not the repository root as a static directory. The generated `dist/index.html` references the external modules in `dist/assets/js/`.

## GitHub upload

Upload the repository contents at the root of the GitHub repository. Do not upload the ZIP as a single file, and do not create an extra `cme121/` directory level. Keep source, data, tests, scripts, docs, audit reports, and the generated `dist/` build so the project and its deployment artifact remain reproducible and traceable.

## Prototype limitations

- Browser interaction and mobile-device end-to-end testing are not fully complete.
- Some travel information is draft/unverified or time-sensitive; users should verify dynamic information with official sources.
- Local prototype data is stored in the visitor's browser; account/cloud synchronization is not generally implemented.
- Localization coverage is partial; the full site is not yet translated into every supported language.
- `supabase/` contains migration/test materials but does not mean a production backend is deployed or configured.
