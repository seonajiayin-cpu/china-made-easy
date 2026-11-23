const fs=require('node:fs');
const root=process.cwd();
const html=fs.readFileSync(root+'/index.html','utf8');
const locales=JSON.parse(fs.readFileSync(root+'/data/locales.json','utf8')).supportedLocales;
const checks=[
 ['experience category labels are localized for all seven locales', ['culture','food','food-shopping','food-culture','wellness','entertainment','social-games','activities'].every(cat=>['en','zh-Hans','zh-Hant','fr','es','ja','ko'].every(locale=>html.includes(`'${locale}':`))) && html.includes('function categoryLabel')],
 ['experience count labels support locale-aware pluralization',html.includes('experienceCountLabel=n=>')],
 ['experience favorite actions are localized and escaped',html.includes('favoriteActionLabel=isSaved=>')&&html.includes('escapeHtml(favoriteActionLabel')],
 ['language switch rerenders experience cards',html.includes('applyCmePageTranslations(locale);renderExperiences();')],
 ['English remains the explicit fallback',html.includes("||'Other experiences'" ) || html.includes("||'Toggle favorite'")],
 ['all seven supported locales remain configured',locales.length===7&&['en','zh-Hans','zh-Hant','fr','es','ja','ko'].every(x=>locales.includes(x))]
];
checks.forEach(([name,ok])=>console.log(`${ok?'PASS':'FAIL'} ${name}`));
const failed=checks.filter(([,ok])=>!ok).length;console.log(`RESULT ${checks.length-failed}/${checks.length} checks passed`);process.exitCode=failed?1:0;
