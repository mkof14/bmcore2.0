import { useState, useEffect, useCallback } from 'react';

interface BackgroundSyncState {
  isSupported: boolean;
  isSyncing: boolean;
  hasPendingData: boolean;
}

interface SyncData {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  timestamp: number;
}

export function useBackgroundSync() {
  const [state, setState] = useState<BackgroundSyncState>({
    isSupported: 'serviceWorker' in navigator && 'SyncManager' in window,
    isSyncing: false,
    hasPendingData: false,
  });

  useEffect(() => {
    if (!state.isSupported) return;

    checkPendingData();
  }, [state.isSupported]);

  async function checkPendingData() {
    try {
      const db = await openDB();
      const count = await db.count('pending-sync');
      setState((prev) => ({
        ...prev,
        hasPendingData: count > 0,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('StackBlitz') || errorMessage.includes('WebContainer')) {
        return;
      }
      console.error('Error checking pending data:', error);
    }
  }

  const queueSync = useCallback(async (data: Omit<SyncData, 'id' | 'timestamp'>) => {
    if (!state.isSupported) {
      return false;
    }

    try {
      const db = await openDB();
      const syncData: SyncData = {
        ...data,
        timestamp: Date.now(),
      };

      await db.add('pending-sync', syncData);

      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-data');

      setState((prev) => ({
        ...prev,
        hasPendingData: true,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('StackBlitz') || errorMessage.includes('WebContainer')) {
        return false;
      }
      console.error('Error queuing sync:', error);
      return false;
    }
  }, [state.isSupported]);

  const clearPendingData = useCallback(async () => {
    try {
      const db = await openDB();
      await db.clear('pending-sync');
      setState((prev) => ({
        ...prev,
        hasPendingData: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('StackBlitz') || errorMessage.includes('WebContainer')) {
        return;
      }
      console.error('Error clearing pending data:', error);
    }
  }, []);

  const getPendingData = useCallback(async (): Promise<SyncData[]> => {
    try {
      const db = await openDB();
      return await db.getAll('pending-sync');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('StackBlitz') || errorMessage.includes('WebContainer')) {
        return [];
      }
      console.error('Error getting pending data:', error);
      return [];
    }
  }, []);

  return {
    ...state,
    queueSync,
    clearPendingData,
    getPendingData,
    checkPendingData,
  };
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('biomath-offline-db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('pending-sync')) {
        const store = db.createObjectStore('pending-sync', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

declare global {
  interface IDBDatabase {
    add(storeName: string, value: any): Promise<IDBValidKey>;
    getAll(storeName: string): Promise<any[]>;
    clear(storeName: string): Promise<void>;
    count(storeName: string): Promise<number>;
    delete(storeName: string, key: IDBValidKey): Promise<void>;
  }
}

IDBDatabase.prototype.add = function (storeName: string, value: any): Promise<IDBValidKey> {
  return new Promise((resolve, reject) => {
    const transaction = this.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

IDBDatabase.prototype.getAll = function (storeName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const transaction = this.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

IDBDatabase.prototype.clear = function (storeName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = this.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

IDBDatabase.prototype.count = function (storeName: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const transaction = this.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

IDBDatabase.prototype.delete = function (storeName: string, key: IDBValidKey): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = this.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
