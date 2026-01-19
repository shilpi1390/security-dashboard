/**
 * IndexedDB cache manager for large vulnerability data
 * Can handle datasets much larger than localStorage (50MB+)
 */

const DB_NAME = 'VulnerabilityCache';
const DB_VERSION = 1;
const STORE_NAME = 'vulnerabilities';
const CACHE_KEY = 'main_data';
const CACHE_EXPIRY_HOURS = 24;

interface CachedData {
  id: string;
  data: any;
  timestamp: number;
  version: string;
}

/**
 * Open IndexedDB connection
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(cachedData: CachedData): boolean {
  const now = Date.now();
  const expiryTime = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
  return now - cachedData.timestamp < expiryTime;
}

/**
 * Get data from IndexedDB cache
 */
export async function getFromCache(): Promise<any | null> {
  try {
    const db = await openDB();

    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CACHE_KEY);

      request.onsuccess = () => {
        const cached = request.result as CachedData | undefined;

        if (!cached) {
          console.log('📭 No cached data found');
          resolve(null);
          return;
        }

        if (isCacheValid(cached)) {
          const ageMinutes = Math.round((Date.now() - cached.timestamp) / (1000 * 60));
          console.log(`✅ Loaded from cache (age: ${ageMinutes} minutes)`);
          resolve(cached.data);
        } else {
          console.log('❌ Cache expired, will fetch fresh data');
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('Error reading from cache:', request.error);
        resolve(null);
      };

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return null;
  }
}

/**
 * Save data to IndexedDB cache
 */
export async function saveToCache(data: any): Promise<void> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const cached: CachedData = {
        id: CACHE_KEY,
        data,
        timestamp: Date.now(),
        version: '1.0',
      };

      const request = store.put(cached);

      request.onsuccess = () => {
        console.log('💾 Data cached successfully in IndexedDB');
        resolve();
      };

      request.onerror = () => {
        console.error('Error saving to cache:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to save to IndexedDB:', error);
  }
}

/**
 * Clear the cache
 */
export async function clearCache(): Promise<void> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(CACHE_KEY);

      request.onsuccess = () => {
        console.log('🗑️  Cache cleared from IndexedDB');
        resolve();
      };

      request.onerror = () => {
        console.error('Error clearing cache:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

/**
 * Get cache info
 */
export async function getCacheInfo(): Promise<{ cached: boolean; age?: number; size?: number }> {
  try {
    const db = await openDB();

    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CACHE_KEY);

      request.onsuccess = () => {
        const cached = request.result as CachedData | undefined;

        if (!cached) {
          resolve({ cached: false });
          return;
        }

        const ageHours = (Date.now() - cached.timestamp) / (1000 * 60 * 60);
        const sizeKB = Math.round(
          new Blob([JSON.stringify(cached.data)]).size / 1024
        );

        resolve({
          cached: true,
          age: Math.round(ageHours * 10) / 10,
          size: sizeKB,
        });
      };

      request.onerror = () => {
        resolve({ cached: false });
      };

      transaction.oncomplete = () => db.close();
    });
  } catch {
    return { cached: false };
  }
}
