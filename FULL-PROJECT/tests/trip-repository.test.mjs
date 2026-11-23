import test from 'node:test';
import assert from 'node:assert/strict';
import { createTripRepository } from '../src/core/trip-repository.js';
function memoryStorage(){const data=new Map();return {getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};}
const trip=(id='t1')=>({id,name:'Test trip',city:'Shanghai',days:1,style:'balanced',slots:[{morning:'A',afternoon:'',evening:''}],dayLocks:[false],pinnedSlots:[]});
test('repository saves, lists, gets and updates saved trips without duplicate IDs',()=>{const r=createTripRepository(memoryStorage());r.saveTrip(trip());r.saveTrip({...trip(),name:'Updated'});assert.equal(r.listSavedTrips().length,1);assert.equal(r.getSavedTrip('t1').name,'Updated');});
test('delete removes trip and legacy latest-trip pointer',()=>{const s=memoryStorage(),r=createTripRepository(s);r.saveTrip(trip());assert.equal(r.deleteTrip('t1'),0);assert.equal(r.getSavedTrip('t1'),null);assert.equal(s.getItem('cme-saved-trip-v1'),null);});
test('draft round trip and clear',()=>{const r=createTripRepository(memoryStorage());r.saveDraft(trip('draft'));assert.equal(r.getDraft().kind,'draft');r.clearDraft();assert.equal(r.getDraft(),null);});
test('versions are numbered and capped at 20',()=>{const r=createTripRepository(memoryStorage());for(let i=0;i<22;i++)r.saveVersion('t1',trip(),{versionName:`V${i}`});const versions=r.listVersions('t1');assert.equal(versions.length,20);assert.equal(versions[0].version,22);});
test('legacy single-trip key is readable when trip list is empty',()=>{const s=memoryStorage();s.setItem('cme-saved-trip-v1',JSON.stringify(trip('legacy')));const r=createTripRepository(s);assert.equal(r.listSavedTrips()[0].id,'legacy');});
