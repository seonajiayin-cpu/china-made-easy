import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTripRecord, validateTripRecord, TRIP_SCHEMA_VERSION } from '../src/core/index.js';
import { createStorageAdapter } from '../src/core/index.js';
import { flexibleSlots, protectedSlotSummary } from '../src/planner/index.js';

function memoryStorage() {
  const map = new Map();
  return {
    getItem(key) { return map.has(key) ? map.get(key) : null; },
    setItem(key, value) { map.set(key, String(value)); },
    removeItem(key) { map.delete(key); }
  };
}

test('schema normalizes a legacy record to current version', () => {
  const trip = normalizeTripRecord({ city: 'Beijing', days: 2, slots: [{ morning: 'A' }] });
  assert.equal(trip.schemaVersion, TRIP_SCHEMA_VERSION);
  assert.equal(trip.slots.length, 2);
  assert.equal(trip.slots[1].evening, '');
  assert.equal(validateTripRecord(trip), true);
});

test('schema rejects non-record input', () => {
  assert.equal(normalizeTripRecord(null), null);
  assert.equal(validateTripRecord([]), false);
});

test('storage adapter supports string and JSON operations', () => {
  const adapter = createStorageAdapter(memoryStorage());
  adapter.set('key', 7);
  assert.equal(adapter.get('key'), '7');
  adapter.setJSON('trip', { city: 'Shanghai' });
  assert.deepEqual(adapter.getJSON('trip'), { city: 'Shanghai' });
  adapter.set('bad', '{');
  assert.equal(adapter.getJSON('bad', 'fallback'), 'fallback');
  adapter.remove('key');
  assert.equal(adapter.get('key'), null);
});

test('constraints preserve locked and pinned slots', () => {
  const trip = { city: 'Shanghai', days: 2, slots: [{ morning: 'A', afternoon: 'B', evening: 'C' }, {}], dayLocks: [true, false], pinnedSlots: ['1:morning'] };
  const flexible = flexibleSlots(trip);
  assert.deepEqual(flexible.map(slot => `${slot.dayIndex}:${slot.slot}`), ['1:afternoon', '1:evening']);
  assert.deepEqual(protectedSlotSummary(trip), { lockedDays: [0], pinnedSlots: ['1:morning'], flexibleSlots: 2 });
});
