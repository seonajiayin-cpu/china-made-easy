const fs=require('node:fs');
const root=process.cwd();
const datasets={cities:JSON.parse(fs.readFileSync(root+'/data/cities.json','utf8')),attractions:JSON.parse(fs.readFileSync(root+'/data/attractions.json','utf8')),experiences:JSON.parse(fs.readFileSync(root+'/data/experiences.json','utf8'))};
const checks=[];
for(const [name,records] of Object.entries(datasets)){
 const ids=records.map(r=>r.id).filter(Boolean);
 checks.push([`${name} records have unique IDs`,ids.length===new Set(ids).size]);
 const fields=name==='cities'?['introLocales']:name==='attractions'?['summary']:['names','descriptions','guide'];
 for(const field of fields){
  const seen=new Map();
  for(const record of records){
   const value=record[field];
   if(value&&typeof value==='object'){
    for(const [locale,text] of Object.entries(value)){
     if(typeof text==='string'&&text.trim()){const key=locale+'|'+text.trim();seen.set(key,(seen.get(key)||0)+1);}
    }
   }else if(typeof value==='string'&&value.trim()){
    const key='en|'+value.trim();seen.set(key,(seen.get(key)||0)+1);
   }
  }
  const dup=[...seen.values()].some(count=>count>1);
  checks.push([`${name}.${field} has no exact duplicate localized text`,!dup]);
 }
}
checks.forEach(([name,ok])=>console.log(`${ok?'PASS':'FAIL'} ${name}`));
const failed=checks.filter(([,ok])=>!ok).length;console.log(`RESULT ${checks.length-failed}/${checks.length} checks passed`);process.exitCode=failed?1:0;
