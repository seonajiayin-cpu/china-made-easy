# Issue Repair — v0.1.139

## Completed
- Added French, Spanish, Japanese and Korean attraction names for all 52 attraction records.
- Converted the `zh-Hant` attraction names to Traditional Chinese where mapped.
- Added concise machine-assisted-draft highlights to 31 records with empty highlight arrays, based on their existing English summaries.
- Translated the eight missing attraction summaries for Guangzhou and Shenzhen into Simplified Chinese, Traditional Chinese, French, Spanish, Japanese and Korean.
- All new/edited localized content remains explicitly machine-assisted draft and requires editorial review. No live ticketing, opening-hours, booking or source claims were invented.
- Coordinate-free data policy retained.

## Audit
- v0.1.138 findings: 698 warnings.
- v0.1.139 findings: 411 warnings.
- Reduction: 287 findings.

## Remaining warnings
- 52 missing image sets.
- 46 address verification status warnings.
- 41 official booking URL warnings.
- 28? summary locale gaps remain (counts per locale vary; inspect report).
- 25 ticketing information warnings.
- 22 ticketing verification date warnings.
- 21 opening-hours warnings and 21 verification-date warnings.
- 7 source URL warnings and 7 source-date warnings.
- 1 address-source warning.

These remain unresolved until source-based verification or assets are supplied.

## Verification
- Module tests: 21/21 passed.
- Localization validator: 6/6 passed.
- Content duplicate validator: 8/8 passed.
- Information architecture validator: 13/13 passed; static DOM IDs: 178/178 unique.
- Preview and distribution build completed.
- 52 attractions; address and Chinese address fields present on 52/52; coordinate fields: 0.
