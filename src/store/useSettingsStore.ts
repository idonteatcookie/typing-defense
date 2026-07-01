import { create } from 'zustand';
import { SettingsStorage } from '@/storage/SettingsStorage';
import type { UserSettings } from '@/storage/schema';

interface SettingsStore {
  settings: UserSettings;
  isLoaded: boolean;

  loadFromStorage: () => void;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    version: 1,
    bgmVolume: 0.5,
    sfxVolume: 0.7,
    bgmMuted: false,
    sfxMuted: false,
    difficulty: 'normal',
    typingEngine: 'qwerty',
    showFps: false,
    showDamageNumbers: true,
    particleQuality: 'medium',
  },
  isLoaded: false,

  loadFromStorage: () => {
    const settings = SettingsStorage.getSettings();
    set({ settings, isLoaded: true });
  },

  updateSetting: (key, value) => {
    SettingsStorage.updateSetting(key, value);
    const settings = SettingsStorage.getSettings();
    set({ settings });
  },

  resetSettings: () => {
    SettingsStorage.resetSettings();
    const settings = SettingsStorage.getSettings();
    set({ settings });
  },
}));
