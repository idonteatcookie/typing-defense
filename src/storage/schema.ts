import type { TypingEngineType, Difficulty } from '@/game/types/game';

export const STORAGE_VERSION = 1;
export const STORAGE_KEY_GAME_SAVE = 'game_save';
export const STORAGE_KEY_SETTINGS = 'settings';

export interface GameSaveData {
  version: number;
  updatedAt: number;
  levelProgress: LevelProgressMap;
  totalStats: TotalStats;
}

export interface LevelProgressMap {
  [levelId: number]: LevelProgress;
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  stars: number;
  bestScore: number;
  bestWpm: number;
  bestAccuracy: number;
  playCount: number;
  lastPlayedAt: number;
}

export interface TotalStats {
  totalKills: number;
  totalGoldEarned: number;
  totalPlayTime: number;
  totalKeystrokes: number;
  totalCorrectKeystrokes: number;
  highestCombo: number;
  maxLevelUnlocked: number;
  totalGamesPlayed: number;
  totalVictories: number;
  totalDefeats: number;
}

export interface UserSettings {
  version: number;
  bgmVolume: number;
  sfxVolume: number;
  bgmMuted: boolean;
  sfxMuted: boolean;
  difficulty: Difficulty;
  typingEngine: TypingEngineType;
  showFps: boolean;
  showDamageNumbers: boolean;
  particleQuality: 'low' | 'medium' | 'high';
}
