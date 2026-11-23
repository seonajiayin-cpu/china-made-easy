/* Phase 20 browser runtime bridge: local-first repository API for the legacy app. */
(function (global) {
  'use strict';
  const KEYS = { savedTrips: 'cme-saved-trips-v1', latestSavedTrip: 'cme-saved-trip-v1', draft: 'cme-planner-draft-v1', versions: 'cme-trip-versions-v1' };
  const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
  const read = (key, fallback) => { try { const raw = CMEStorage.getItem(key); return raw == null ? fallback : JSON.parse(raw); } catch (_) { return fallback; } };
  const write = (key, value) => CMEStorage.setItem(key, JSON.stringify(value));
  const normalize = (record, kind) => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
    const slots = Array.isArray(record.slots) ? record.slots : [];
    const days = Math.max(1, Math.min(30, Number(record.days) || slots.length || 1));
    const cleanSlots = slots.slice(0, days).map(s => ({ morning: String(s?.morning ?? ''), afternoon: String(s?.afternoon ?? ''), evening: String(s?.evening ?? '') }));
    while (cleanSlots.length < days) cleanSlots.push({ morning: '', afternoon: '', evening: '' });
    const locks = Array.isArray(record.dayLocks) ? record.dayLocks.slice(0, days).map(Boolean) : Array(days).fill(false);
    while (locks.length < days) locks.push(false);
    const validPin = p => typeof p === 'string' && /^\d+:(morning|afternoon|evening)$/.test(p) && Number(p.split(':')[0]) < days;
    return { ...record, schemaVersion: 4, city: String(record.city || 'Shanghai'), days, slots: cleanSlots, style: String(record.style || 'balanced'), dayLocks: locks, pinnedSlots: [...new Set((Array.isArray(record.pinnedSlots) ? record.pinnedSlots : []).filter(validPin))], savedAt: String(record.savedAt || record.updatedAt || new Date().toISOString()), kind };
  };
  const list = () => { const a = read(KEYS.savedTrips, []); if (Array.isArray(a) && a.length) return a.map(t => normalize(t, 'saved-trip')).filter(Boolean); const legacy = normalize(read(KEYS.latestSavedTrip, null), 'saved-trip'); return legacy ? [legacy] : []; };
  const versions = () => { const v = read(KEYS.versions, {}); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; };
  const api = Object.freeze({
    listSavedTrips: list,
    getSavedTrip(id) { return list().find(t => t.id === String(id)) || null; },
    saveTrip(record) { const n = normalize({ ...record, id: record?.id || `trip-${Date.now()}`, savedAt: record?.savedAt || new Date().toISOString() }, 'saved-trip'); if (!n) throw new TypeError('Invalid trip'); const trips = list().filter(t => t.id !== n.id); trips.unshift(n); write(KEYS.savedTrips, trips); write(KEYS.latestSavedTrip, n); return clone(n); },
    deleteTrip(id) { const trips = list().filter(t => t.id !== String(id)); write(KEYS.savedTrips, trips); if (trips[0]) write(KEYS.latestSavedTrip, trips[0]); else CMEStorage.removeItem(KEYS.latestSavedTrip); const v = versions(); delete v[String(id)]; write(KEYS.versions, v); return trips.length; },
    saveDraft(record) { const n = normalize({ ...record, savedAt: record?.savedAt || new Date().toISOString() }, 'draft'); if (!n) throw new TypeError('Invalid draft'); write(KEYS.draft, n); return clone(n); },
    getDraft() { return normalize(read(KEYS.draft, null), 'draft'); }, clearDraft() { CMEStorage.removeItem(KEYS.draft); },
    listVersions(id) { return clone(versions()[String(id)] || []); },
    saveVersion(id, record, metadata = {}) { if (!id) throw new TypeError('tripId required'); const n = normalize({ ...record, savedAt: record?.savedAt || new Date().toISOString() }, 'version'); if (!n) throw new TypeError('Invalid version'); const v = versions(), arr = v[String(id)] || []; const next = Math.max(0, ...arr.map(x => Number(x.version) || 0)) + 1; const item = { ...n, version: next, versionName: metadata.versionName || `Version ${next}` }; v[String(id)] = [item, ...arr].slice(0, 20); write(KEYS.versions, v); return clone(item); },
    storageKeys: KEYS
  });
  global.CMETripRepository = api;
})(window);
