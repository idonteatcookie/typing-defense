import { STORAGE_PREFIX } from '@/constants/gameConstants';

enum StorageKey {
  GameSave = 'game_save',
  Settings = 'settings',
}

export class StorageService {
  private static prefix = STORAGE_PREFIX;

  static set<T>(key: StorageKey, value: T): void {
    try {
      const fullKey = this.prefix + key;
      const json = JSON.stringify(value);
      localStorage.setItem(fullKey, json);
    } catch (e) {
      console.error('Storage set error:', e);
    }
  }

  static get<T>(key: StorageKey, defaultValue: T): T {
    try {
      const fullKey = this.prefix + key;
      const json = localStorage.getItem(fullKey);
      if (json === null) return defaultValue;
      return JSON.parse(json) as T;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  }

  static remove(key: StorageKey): void {
    const fullKey = this.prefix + key;
    localStorage.removeItem(fullKey);
  }

  static clear(): void {
    Object.values(StorageKey).forEach(key => {
      localStorage.removeItem(this.prefix + key);
    });
  }

  static hasSave(): boolean {
    const fullKey = this.prefix + StorageKey.GameSave;
    return localStorage.getItem(fullKey) !== null;
  }
}

export { StorageKey };
