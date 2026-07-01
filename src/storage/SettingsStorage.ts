import { StorageService, StorageKey } from './StorageService';
import type { UserSettings } from './schema';
import { STORAGE_VERSION } from './schema';

export class SettingsStorage {
  static getSettings(): UserSettings {
    return StorageService.get<UserSettings>(
      StorageKey.Settings,
      this.createDefaultSettings()
    );
  }

  static saveSettings(settings: UserSettings): void {
    StorageService.set(StorageKey.Settings, settings);
  }

  static updateSetting<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): void {
    const settings = this.getSettings();
    settings[key] = value;
    this.saveSettings(settings);
  }

  static resetSettings(): void {
    StorageService.remove(StorageKey.Settings);
  }

  private static createDefaultSettings(): UserSettings {
    return {
      version: STORAGE_VERSION,
      bgmVolume: 0.5,
      sfxVolume: 0.7,
      bgmMuted: false,
      sfxMuted: false,
      difficulty: 'normal',
      typingEngine: 'qwerty',
      showFps: false,
      showDamageNumbers: true,
      particleQuality: 'medium',
    };
  }
}
