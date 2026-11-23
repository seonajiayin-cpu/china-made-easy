import { TRIP_SLOT_KEYS, normalizeTripRecord } from '../core/trip-schema.js';

export function isSlotPinned(dayIndex, slot, pinnedSlots = []) {
  return pinnedSlots.includes(`${dayIndex}:${slot}`);
}

export function isDayLocked(dayIndex, dayLocks = []) {
  return Boolean(dayLocks[dayIndex]);
}

export function flexibleSlots(record) {
  const trip = normalizeTripRecord(record, 'planner');
  if (!trip) return [];
  const result = [];
  trip.slots.forEach((day, dayIndex) => {
    if (isDayLocked(dayIndex, trip.dayLocks)) return;
    TRIP_SLOT_KEYS.forEach(slot => {
      if (!isSlotPinned(dayIndex, slot, trip.pinnedSlots)) result.push({ dayIndex, slot, currentValue: day[slot] });
    });
  });
  return result;
}

export function protectedSlotSummary(record) {
  const trip = normalizeTripRecord(record, 'planner');
  if (!trip) return { lockedDays: [], pinnedSlots: [], flexibleSlots: 0 };
  const lockedDays = trip.dayLocks.map((locked, index) => locked ? index : -1).filter(index => index >= 0);
  const pinnedSlots = trip.pinnedSlots.slice();
  return { lockedDays, pinnedSlots, flexibleSlots: flexibleSlots(trip).length };
}
