import { createStorageAdapter } from './storage-adapter.js';
import { migrateTripRecord, normalizeTripRecord } from './trip-schema.js';

export const TRIP_STORAGE_KEYS = Object.freeze({
  savedTrips: 'cme-saved-trips-v1',
  latestSavedTrip: 'cme-saved-trip-v1',
  draft: 'cme-planner-draft-v1',
  versions: 'cme-trip-versions-v1'
});

const clone = value => JSON.parse(JSON.stringify(value));

/** Local-first repository preserving the app's existing v1 storage keys. */
export function createTripRepository(storage) {
  const store = createStorageAdapter(storage);
  const readArray = key => {
    const value = store.getJSON(key, []);
    return Array.isArray(value) ? value : [];
  };
  const readVersions = () => {
    const value = store.getJSON(TRIP_STORAGE_KEYS.versions, {});
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  };
  function listSavedTrips() {
    const list = readArray(TRIP_STORAGE_KEYS.savedTrips).map(t => migrateTripRecord(t, 'saved-trip')).filter(Boolean);
    if (list.length) return list;
    const legacy = store.getJSON(TRIP_STORAGE_KEYS.latestSavedTrip, null);
    const migrated = migrateTripRecord(legacy, 'saved-trip');
    return migrated ? [migrated] : [];
  }
  function getSavedTrip(id) { return listSavedTrips().find(t => t.id === String(id)) || null; }
  function saveTrip(record) {
    const normalized = normalizeTripRecord({ ...record, id: record?.id || `trip-${Date.now()}`, savedAt: record?.savedAt || new Date().toISOString() }, 'saved-trip');
    if (!normalized) throw new TypeError('Invalid trip record');
    const trips = listSavedTrips().filter(t => t.id !== normalized.id);
    trips.unshift(normalized);
    store.setJSON(TRIP_STORAGE_KEYS.savedTrips, trips);
    store.setJSON(TRIP_STORAGE_KEYS.latestSavedTrip, normalized);
    return clone(normalized);
  }
  function deleteTrip(id) {
    const trips = listSavedTrips().filter(t => t.id !== String(id));
    store.setJSON(TRIP_STORAGE_KEYS.savedTrips, trips);
    if (trips[0]) store.setJSON(TRIP_STORAGE_KEYS.latestSavedTrip, trips[0]);
    else store.remove(TRIP_STORAGE_KEYS.latestSavedTrip);
    const versions = readVersions(); delete versions[String(id)]; store.setJSON(TRIP_STORAGE_KEYS.versions, versions);
    return trips.length;
  }
  function saveDraft(record) {
    const draft = normalizeTripRecord({ ...record, savedAt: record?.savedAt || new Date().toISOString() }, 'draft');
    if (!draft) throw new TypeError('Invalid draft record');
    store.setJSON(TRIP_STORAGE_KEYS.draft, draft); return clone(draft);
  }
  function getDraft() { return migrateTripRecord(store.getJSON(TRIP_STORAGE_KEYS.draft, null), 'draft'); }
  function clearDraft() { store.remove(TRIP_STORAGE_KEYS.draft); }
  function listVersions(tripId) { return clone(readVersions()[String(tripId)] || []); }
  function saveVersion(tripId, record, metadata = {}) {
    if (!tripId) throw new TypeError('tripId is required');
    const normalized = normalizeTripRecord({ ...record, savedAt: record?.savedAt || new Date().toISOString() }, 'version');
    if (!normalized) throw new TypeError('Invalid version record');
    const versions = readVersions(); const list = versions[String(tripId)] || [];
    const nextVersion = Math.max(0, ...list.map(v => Number(v.version) || 0)) + 1;
    const version = { ...normalized, version: nextVersion, versionName: metadata.versionName || `Version ${nextVersion}` };
    versions[String(tripId)] = [version, ...list].slice(0, 20); store.setJSON(TRIP_STORAGE_KEYS.versions, versions);
    return clone(version);
  }
  return Object.freeze({ listSavedTrips, getSavedTrip, saveTrip, deleteTrip, saveDraft, getDraft, clearDraft, listVersions, saveVersion, storageKeys: TRIP_STORAGE_KEYS });
}
