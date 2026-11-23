import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root=new URL('../',import.meta.url);
const html=fs.readFileSync(new URL('index.html',root),'utf8');
test('all inline scripts parse as JavaScript',()=>{
  const re=/<script\b([^>]*)>([\s\S]*?)<\/script>/gi;let match,count=0;
  while((match=re.exec(html))){
    if(!match[2].trim()||/\bsrc\s*=/.test(match[1]))continue;
    count++;const file=path.join(os.tmpdir(),`cme-inline-${process.pid}-${count}.js`);fs.writeFileSync(file,match[2]);
    const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});fs.unlinkSync(file);
    assert.equal(result.status,0,`Inline script ${count} failed syntax check:\n${result.stderr}`);
  }
  assert.ok(count>=25,`Expected a comprehensive inline script sweep, checked ${count}`);
});
test('offline kit print function contains no nested script or copied page template',()=>{
  const start=html.indexOf('function cmeKitPrint(){');assert.ok(start>=0);
  const end=html.indexOf('\nfunction cmeKitClear(){',start);assert.ok(end>start);
  const body=html.slice(start,end);
  assert.doesNotMatch(body,/<script|phase\d{2,3}-/i);
  assert.match(body,/Offline Travel Kit/);
  assert.match(body,/window\.open/);
});
