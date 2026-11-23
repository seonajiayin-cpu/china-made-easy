/** Small injectable storage adapter; browser storage is supplied by the host. */
export function createStorageAdapter(storage) {
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
    throw new TypeError('A Storage-compatible object is required');
  }
  return Object.freeze({
    get(key) { return storage.getItem(String(key)); },
    set(key, value) { storage.setItem(String(key), String(value)); return true; },
    remove(key) { storage.removeItem(String(key)); },
    getJSON(key, fallback = null) {
      try { const raw = storage.getItem(String(key)); return raw == null ? fallback : JSON.parse(raw); }
      catch { return fallback; }
    },
    setJSON(key, value) { storage.setItem(String(key), JSON.stringify(value)); return true; }
  });
}
