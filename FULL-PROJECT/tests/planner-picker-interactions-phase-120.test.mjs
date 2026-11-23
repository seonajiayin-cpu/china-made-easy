import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
function extract(name,next){const start=html.indexOf(`function ${name}(`);assert.notEqual(start,-1,`${name} exists`);const end=html.indexOf(`\n${next}`,start);assert.notEqual(end,-1,`${next} boundary exists`);return html.slice(start,end);}
const source=[
 extract('plannerAddPlaceToSlot','function addPlannerAttraction'),
 extract('addPlannerAttraction','function addPlannerCustomPlace'),
 extract('addPlannerCustomPlace','function bindPlannerPickerActions'),
 extract('bindPlannerPickerActions','let plannerHistory')
].join('\n');
function el(value=''){return {value,textContent:'',dataset:{},listeners:{},addEventListener(type,fn){this.listeners[type]=fn;},dispatch(type,event={}){this.listeners[type]?.(event);}};}
function setup(){const fields={
 'planner-attraction-day':el('1'),'planner-attraction-slot':el('afternoon'),'planner-city':el('Chengdu'),'planner-style':el('balanced'),
 'planner-picker-status':el(''),'planner-custom-place-name':el(''),'planner-add-custom-place':el(''),'planner-attraction-list':el()
};const list=el();fields['planner-attraction-list']=list;const calls=[];const ctx={document:{getElementById:id=>fields[id]||null},currentItineraryDays:[{morning:'A',afternoon:'',evening:''},{morning:'B',afternoon:'',evening:''}],attractionData:{Chengdu:[{id:'test-1',name:{en:'Test attraction'},summary:{en:'Summary'}}]},attractionName:r=>r.name?.en||r.name,renderEditableItinerary:(city,days,style,slots)=>calls.push({city,days,style,slots:slots.map(x=>({...x}))}),escapeHtml:x=>String(x),alert:()=>{},console,documentQuerySelectorAll:()=>[]};ctx.document.getElementById= id=>fields[id]||null;ctx.document.querySelectorAll=()=>[];ctx.document.querySelector=()=>null;ctx.document.createElement=()=>({className:'',textContent:'',insertAdjacentElement(){}});ctx.document.body={};vm.createContext(ctx);vm.runInContext(source,ctx);return {ctx,fields,list,calls};}
test('custom Add button is bound and adds to selected day/slot then clears input',()=>{const {ctx,fields,calls}=setup();ctx.bindPlannerPickerActions();fields['planner-custom-place-name'].value='Test Destination';fields['planner-attraction-day'].value='1';fields['planner-attraction-slot'].value='afternoon';fields['planner-add-custom-place'].dispatch('click');assert.equal(ctx.currentItineraryDays[1].afternoon,'Test Destination');assert.equal(fields['planner-custom-place-name'].value,'');assert.equal(calls.at(-1).city,'Chengdu');assert.match(fields['planner-picker-status'].textContent,/Added/);});
test('Enter key uses the same custom destination action',()=>{const {ctx,fields,calls}=setup();ctx.bindPlannerPickerActions();fields['planner-custom-place-name'].value='Enter Destination';fields['planner-custom-place-name'].dispatch('keydown',{key:'Enter',preventDefault(){this.prevented=true;}});assert.equal(ctx.currentItineraryDays[1].afternoon,'Enter Destination');assert.equal(calls.length,1);});
test('attraction-list delegation resolves card ID and adds attraction',()=>{const {ctx,fields,calls,list}=setup();ctx.bindPlannerPickerActions();const card={dataset:{attractionId:'test-1'},closest(selector){return selector==='[data-attraction-id]'?this:null;}};const button={closest(selector){return selector==='[data-add-attraction]'?this:null;},parentElement:card,closestCard:card};const target={closest(selector){return selector==='[data-add-attraction]'?button:null;}};button.closest=selector=>selector==='[data-attraction-id]'?card:null;list.dispatch('click',{target});assert.equal(ctx.currentItineraryDays[1].afternoon,'Test attraction');assert.equal(calls.at(-1).city,'Chengdu');});
