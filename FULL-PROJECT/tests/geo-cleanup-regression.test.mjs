import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const read=name=>fs.readFileSync(new URL(name,root),'utf8');
function functionLine(source,name){const start=source.indexOf(`function ${name}`);assert.ok(start>=0,`${name} exists`);const end=source.indexOf('\n',start);return source.slice(start,end>start?end:source.length);}
const html=read('index.html');

test('readiness analysis no longer contains geographic scoring',()=>{
  const body=functionLine(html,'cmePhase96Analyze');
  assert.doesNotMatch(body,/geoAvg|geoScore|centroid|geographic/i);
});

test('phase 96 renderer does not dereference removed distance values',()=>{
  const body=functionLine(html,'cmePhase96Render');
  assert.doesNotMatch(body,/geoAvg|geoScore|\.toFixed\(/);
  assert.match(body,/Attraction matching/);
});

test('obsolete geographic optimization assets are not included or referenced',()=>{
  assert.ok(!fs.existsSync(new URL('assets/js/phase82-planner-quality.js',root)));
  assert.ok(!fs.existsSync(new URL('assets/js/phase97-optimization-workflow.js',root)));
  assert.doesNotMatch(html,/<script[^>]+src=["']assets\/js\//i);
});

test('distribution is self-contained and byte-identical to source after build',()=>{
  assert.equal(read('dist/index.html'),html);
  const manifest=JSON.parse(read('dist/build-manifest.json'));
  assert.equal(manifest.mode,'self-contained-html');
  assert.equal(manifest.externalAssets,0);
  assert.equal(manifest.version,JSON.parse(read('package.json')).version);
});
