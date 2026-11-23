#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cities=read('data/cities.json'), attractions=read('data/attractions.json'), experiences=read('data/experiences.json');
const locales=['en','zh-Hans','zh-Hant','fr','es','ja','ko'];
const findings=[];
function add(entityType,id,cityId,check,severity,detail){findings.push({entityType,id,cityId:cityId||null,check,severity,detail});}
function nonempty(v){return typeof v==='string'&&v.trim().length>0;}
function validHttps(v){try{return new URL(v).protocol==='https:';}catch{return false;}}
function validDate(v){return nonempty(v)&&!Number.isNaN(Date.parse(v));}
function uniqueAudit(arr,type){const seen=new Set();for(const x of arr){if(!nonempty(x.id))add(type,x.id,null,'id','error','Missing or invalid id');else if(seen.has(x.id))add(type,x.id,null,'duplicate-id','error','Duplicate id');else seen.add(x.id);}}
uniqueAudit(cities,'city');uniqueAudit(attractions,'attraction');uniqueAudit(experiences,'experience');
const cityIds=new Set(cities.map(c=>c.id));
for(const c of cities){
  if(c.status==='published'&&c.contentStatus!=='published')add('city',c.id,null,'publication-status-consistency','warning',`status=published but contentStatus=${c.contentStatus||'missing'}`);
  if(c.contentStatus==='published'&&c.status!=='published')add('city',c.id,null,'publication-status-consistency','warning',`contentStatus=published but status=${c.status||'missing'}`);
  if(!nonempty(c.name)||!nonempty(c.nameLocal))add('city',c.id,null,'names','error','Missing name or local name');
  if(!nonempty(c.intro))add('city',c.id,null,'intro','warning','Missing base intro');
  for(const locale of locales)if(!nonempty(c.introLocales?.[locale]))add('city',c.id,null,`intro-locale-${locale}`,'warning',`Missing intro locale ${locale}`);
  if(!Array.isArray(c.themes)||!c.themes.length)add('city',c.id,null,'themes','warning','Missing themes');
}
for(const a of attractions){
  if(!cityIds.has(a.cityId))add('attraction',a.id,a.cityId,'city-reference','error',`Unknown cityId ${a.cityId}`);
  for(const locale of locales){if(!nonempty(a.names?.[locale]))add('attraction',a.id,a.cityId,`name-locale-${locale}`,'warning',`Missing name locale ${locale}`);if(!nonempty(a.summary?.[locale]))add('attraction',a.id,a.cityId,`summary-locale-${locale}`,'warning',`Missing summary locale ${locale}`);}
  if(!nonempty(a.names?.en))add('attraction',a.id,a.cityId,'english-name','error','Missing English name');
  if(!nonempty(a.summary?.en))add('attraction',a.id,a.cityId,'english-summary','error','Missing English summary');
  if(!Array.isArray(a.highlights)||a.highlights.length===0)add('attraction',a.id,a.cityId,'highlights','warning','Empty highlights');
  if(!Array.isArray(a.visitorTips)||a.visitorTips.length===0)add('attraction',a.id,a.cityId,'visitor-tips','warning','Empty visitor tips');
  if(!nonempty(a.address))add('attraction',a.id,a.cityId,'address','error','Missing specific street/location address');
  if(!nonempty(a.addressChinese))add('attraction',a.id,a.cityId,'address-chinese','error','Missing Chinese specific address');
  if(!nonempty(a.addressSource)||!validHttps(a.addressSource))add('attraction',a.id,a.cityId,'address-source','warning','Missing or non-HTTPS address source');
  if(a.addressVerificationStatus!=='verified')add('attraction',a.id,a.cityId,'address-verification','warning',`Address status: ${a.addressVerificationStatus||'missing'}`);
  if(!nonempty(a.openingHours?.text)&&!nonempty(a.openingHours?.schedule))add('attraction',a.id,a.cityId,'opening-hours','warning','No opening-hours content');
  if(!validDate(a.openingHours?.lastVerifiedAt))add('attraction',a.id,a.cityId,'opening-hours-date','warning','Missing/invalid opening-hours verification date');
  if(!nonempty(a.ticketing?.text)&&a.ticketing?.price==null&&!nonempty(a.ticketing?.notes))add('attraction',a.id,a.cityId,'ticketing-info','warning','No ticketing information');
  if(!validDate(a.ticketing?.lastVerifiedAt))add('attraction',a.id,a.cityId,'ticketing-date','warning','Missing/invalid ticketing verification date');
  if(!validHttps(a.ticketing?.officialBookingUrl))add('attraction',a.id,a.cityId,'booking-url','warning','Missing or non-HTTPS official booking URL');
  if(!Array.isArray(a.sources)||!a.sources.length)add('attraction',a.id,a.cityId,'sources','error','No source references');else for(const s of a.sources){if(!validHttps(s.url))add('attraction',a.id,a.cityId,'source-url','warning',`Source URL not HTTPS: ${s.url||'missing'}`);if(!validDate(s.checkedAt))add('attraction',a.id,a.cityId,'source-date','warning',`Missing/invalid source checkedAt: ${s.name||s.url||'unnamed'}`);}
  if(!Array.isArray(a.images)||a.images.length===0)add('attraction',a.id,a.cityId,'images','warning','No images');else for(const img of a.images){if(!nonempty(img.alt))add('attraction',a.id,a.cityId,'image-alt','warning','Image missing alt text');if(!validHttps(img.url||img.src))add('attraction',a.id,a.cityId,'image-url','warning','Image missing HTTPS URL');}
  if(a.contentStatus==='published'){
    const required=[['en name',a.names?.en],['zh-Hans name',a.names?.['zh-Hans']],['en summary',a.summary?.en],['source',Array.isArray(a.sources)&&a.sources.length>0],['image',Array.isArray(a.images)&&a.images.length>0]];
    for(const [label,value] of required)if(!value)add('attraction',a.id,a.cityId,'published-minimum-standard','error',`Published record fails minimum: ${label}`);
  }
}
for(const e of experiences){
  for(const locale of locales){if(!nonempty(e.names?.[locale]))add('experience',e.id,null,`name-locale-${locale}`,'warning',`Missing name locale ${locale}`);if(!nonempty(e.descriptions?.[locale]))add('experience',e.id,null,`description-locale-${locale}`,'warning',`Missing description locale ${locale}`);}
  if(!nonempty(e.names?.en)||!nonempty(e.descriptions?.en))add('experience',e.id,null,'english-content','error','Missing English name or description');
  if(!Array.isArray(e.tags)||!e.tags.length)add('experience',e.id,null,'tags','warning','Missing tags');
  if(!Array.isArray(e.recommendedCityIds))add('experience',e.id,null,'city-recommendations','warning','Missing recommendedCityIds');else for(const id of e.recommendedCityIds)if(!cityIds.has(id))add('experience',e.id,id,'city-reference','error',`Unknown recommended city ${id}`);
}
const counts={city:cities.length,attraction:attractions.length,experience:experiences.length};
const summary={generatedAt:new Date().toISOString(),scope:counts,locales,methodology:'Structural completeness and consistency only. Does not fact-check text, source authenticity, live opening hours, prices, or translation quality.',severityCounts:findings.reduce((o,f)=>(o[f.severity]=(o[f.severity]||0)+1,o),{}),findingCountsByCheck:findings.reduce((o,f)=>(o[f.check]=(o[f.check]||0)+1,o),{}),findingCountsByEntity:findings.reduce((o,f)=>(o[f.entityType]=(o[f.entityType]||0)+1,o),{}),findings};
const outDir=path.join(root,'reports','phase-a6');fs.mkdirSync(outDir,{recursive:true});fs.writeFileSync(path.join(outDir,'content-integrity.json'),JSON.stringify(summary,null,2)+'\n');
const lines=['# Phase A-6 Content Integrity Audit','',`Generated: ${summary.generatedAt}`,'','## Scope',`- Cities: ${counts.city}`,`- Attractions: ${counts.attraction}`,`- Experiences: ${counts.experience}`,'',`## Severity totals`,...Object.entries(summary.severityCounts).map(([k,v])=>`- ${k}: ${v}`),'','## Findings by entity',...Object.entries(summary.findingCountsByEntity).map(([k,v])=>`- ${k}: ${v}`),'','## Findings by check',...Object.entries(summary.findingCountsByCheck).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`- ${k}: ${v}`),'','## Detailed findings',''];
for(const f of findings)lines.push(`- **${f.severity.toUpperCase()} · ${f.entityType} · ${f.id||'(missing ID)'}**${f.cityId?` · ${f.cityId}`:''} — ${f.check}: ${f.detail}`);
lines.push('','## Limitations','This audit checks schema-level presence, consistency, URLs/date formats, locale coverage, and references. It does not establish factual accuracy, link validity, translation quality, image rights, or current operating conditions.');
fs.writeFileSync(path.join(outDir,'content-integrity.md'),lines.join('\n')+'\n');
console.log(`Phase A-6 audit: ${counts.city} cities, ${counts.attraction} attractions, ${counts.experience} experiences; ${findings.length} findings.`);
console.log(JSON.stringify(summary.severityCounts));
console.log(`Reports: reports/phase-a6/content-integrity.{json,md}`);
