const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const locales = JSON.parse(fs.readFileSync(path.join(root, 'data/locales.json'), 'utf8'));
const cities = JSON.parse(fs.readFileSync(path.join(root, 'data/cities.json'), 'utf8'));
const attractions = JSON.parse(fs.readFileSync(path.join(root, 'data/attractions.json'), 'utf8'));
const experiences = JSON.parse(fs.readFileSync(path.join(root, 'data/experiences.json'), 'utf8'));
// Static DOM audit only: IDs/fragments inside script/style source are strings or code,
// not DOM nodes. Remove those blocks before checking to avoid template false positives.
const staticHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
const ids = [...staticHtml.matchAll(/\bid\s*=\s*[\"']([^\"']+)[\"']/g)].map(m => m[1]);
const staticFragments = [...staticHtml.matchAll(/href\s*=\s*[\"']#([^\"']+)[\"']/g)].map(m => m[1]);
const missingFragments = [...new Set(staticFragments.filter(id => !ids.includes(id)))];
const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
const categories = ['category-prepare','category-discover','category-plan','category-ontrip','category-personal','category-help'];
const navAnchors = ['#cme-task-nav','#guides','#cities','#trip-planner','#apps','#my-china'];
const checks = [
  ['all six canonical categories exist', categories.every(id => html.includes(`id="${id}"`))],
  ['desktop nav canonical targets exist', navAnchors.every(a => html.includes(`href="${a}"`))],
  ['visible task navigation has a canonical anchor', html.includes('id="cme-task-nav"') && !html.includes('.cme-phase102-task-nav{display:none')],
  ['mobile Explore points to visible task navigation', html.includes('href="#cme-task-nav" data-nav="explore"')],
  ['locale list includes seven supported languages', locales.supportedLocales.length === 7 && ['en','zh-Hans','zh-Hant','fr','es','ja','ko'].every(x => locales.supportedLocales.includes(x))],
  ['English fallback is configured', locales.defaultLocale === 'en' && locales.translationPolicy?.fallbackLocale === 'en'],
  ['city data baseline is nine', cities.length === 9],
  ['attraction data baseline is 52', attractions.length === 52],
  ['experience data baseline is ten', experiences.length === 10],
  ['phase 135 audit report exists', fs.existsSync(path.join(root,'reports','reports-phase135-information-architecture-audit.md'))],
  ['static fragment links resolve to source IDs', missingFragments.length === 0],
  ['task navigation width follows the shared 1100px content width', html.includes('.cme-phase102-task-nav{max-width:1100px;padding:12px 22px 30px}')],
  ['task cards retain responsive two-column and narrow-screen layouts', html.includes('@media(max-width:760px){.cme-phase102-task-nav{padding:10px 16px 24px}') && html.includes('@media(max-width:420px){.cme-phase102-task-grid{grid-template-columns:1fr}')],
];
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
console.log(`INFO static DOM id-bearing elements=${ids.length}; unique=${new Set(ids).size}; duplicate IDs=${duplicates.length}`);
if (duplicates.length) console.log(`FAIL duplicate IDs in static DOM: ${duplicates.join(', ')}`);
if (missingFragments.length) console.log(`INFO unresolved static fragment targets: ${missingFragments.join(', ')}`);
const failures = checks.filter(([,ok])=>!ok).length + duplicates.length;
console.log(`RESULT ${checks.length-failures}/${checks.length} checks passed`);
process.exitCode = failures ? 1 : 0;
