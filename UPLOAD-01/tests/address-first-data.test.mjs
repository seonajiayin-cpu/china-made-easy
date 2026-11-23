import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const attractions=JSON.parse(fs.readFileSync(new URL('../data/attractions.json',import.meta.url),'utf8'));
const schema=JSON.parse(fs.readFileSync(new URL('../data/schema/attraction.schema.json',import.meta.url),'utf8'));
test('attraction data and schema are coordinate-free',()=>{
  const forbidden=new Set(['latitude','longitude','coordinates','coordinate','location']);
  const visit=(value,path='record')=>{if(Array.isArray(value)){value.forEach((v,i)=>visit(v,`${path}[${i}]`));return;}if(value&&typeof value==='object'){for(const [key,v] of Object.entries(value)){assert.ok(!forbidden.has(key.toLowerCase()),`${path}.${key} must not store GPS coordinates`);visit(v,`${path}.${key}`);}}};
  visit(attractions);visit(schema);
});
test('attraction dataset remains populated and address fields are explicit',()=>{
  assert.ok(attractions.length>=40);
  for(const record of attractions){assert.ok(record.id);assert.ok(record.names?.en);assert.ok(Object.hasOwn(record,'address'));assert.ok(Object.hasOwn(record,'addressChinese'));}
});

test('Former French Concession has an honest area-level address reference',()=>{
  const record=attractions.find(x=>x.id==='shanghai-former-french-concession');
  assert.ok(record);
  assert.match(record.address,/historic area|historical area/i);
  assert.match(record.addressChinese,/历史街区范围/);
  assert.match(record.addressVerificationStatus,/street-level-verification-needed/);
});

test('planner source and distribution contain no GPS or distance calculations',()=>{
  const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const dist=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
  for(const text of [source,dist]){
    for(const forbidden of [/\\blatitude\\b/i,/\\blongitude\\b/i,/plannerDistanceKm/i,/geographicClusters/i,/haversine/i])
      assert.doesNotMatch(text,forbidden);
  }
});
