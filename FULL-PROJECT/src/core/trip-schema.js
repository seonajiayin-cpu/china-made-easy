export const TRIP_SCHEMA_VERSION = 4;
export const TRIP_SLOT_KEYS = Object.freeze(['morning', 'afternoon', 'evening']);

export function normalizeTripSlot(slot = {}) {
  const source = slot && typeof slot === 'object' && !Array.isArray(slot) ? slot : {};
  return Object.fromEntries(TRIP_SLOT_KEYS.map(key => [key, String(source[key] ?? '')]));
}

export function normalizeTripRecord(record, kind = 'saved-trip') {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  const rawSlots = Array.isArray(record.slots) ? record.slots : [];
  const days = Math.max(1, Math.min(30, Number(record.days) || rawSlots.length || 1));
  const slots = rawSlots.slice(0, days).map(normalizeTripSlot);
  while (slots.length < days) slots.push(normalizeTripSlot());
  const dayLocks = Array.isArray(record.dayLocks) ? record.dayLocks.slice(0, days).map(Boolean) : Array(days).fill(false);
  while (dayLocks.length < days) dayLocks.push(false);
  const validPin = value => typeof value === 'string' && /^\d+:(morning|afternoon|evening)$/.test(value) && Number(value.split(':')[0]) < days;
  const pinnedSlots = [...new Set((Array.isArray(record.pinnedSlots) ? record.pinnedSlots : []).filter(validPin))];
  return {
    ...record,
    schemaVersion: TRIP_SCHEMA_VERSION,
    city: String(record.city || 'Shanghai'),
    days,
    slots,
    style: String(record.style || 'balanced'),
    dayLocks,
    pinnedSlots,
    savedAt: String(record.savedAt || record.updatedAt || new Date().toISOString()),
    kind
  };
}

export function migrateTripRecord(record, kind = 'saved-trip') {
  return normalizeTripRecord(record, kind);
}

export function validateTripRecord(record) {
  const normalized = normalizeTripRecord(record);
  return Boolean(normalized && normalized.schemaVersion === TRIP_SCHEMA_VERSION && normalized.slots.length === normalized.days && normalized.dayLocks.length === normalized.days && normalized.slots.every(slot => TRIP_SLOT_KEYS.every(key => typeof slot[key] === 'string')));
}
