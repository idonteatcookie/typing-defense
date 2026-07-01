import { create } from 'zustand';
import { UserStorage } from '@/storage/UserStorage';
import type { LevelProgressMap, TotalStats, LevelProgress } from '@/storage/schema';

interface UserStore {
  levelProgress: LevelProgressMap;
  totalStats: TotalStats;
  isLoaded: boolean;

  loadFromStorage: () => void;
  updateLevelProgress: (levelId: number, progress: Partial<LevelProgress>) => void;
  addTotalStats: (stats: Partial<TotalStats>) => void;
  resetProgress: () => void;
  isLevelUnlocked: (levelId: number) => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
  levelProgress: {},
  totalStats: {
    totalKills: 0,
    totalGoldEarned: 0,
    totalPlayTime: 0,
    totalKeystrokes: 0,
    totalCorrectKeystrokes: 0,
    highestCombo: 0,
    maxLevelUnlocked: 1,
    totalGamesPlayed: 0,
    totalVictories: 0,
    totalDefeats: 0,
  },
  isLoaded: false,

  loadFromStorage: () => {
    const save = UserStorage.getSaveData();
    set({
      levelProgress: save.levelProgress,
      totalStats: save.totalStats,
      isLoaded: true,
    });
  },

  updateLevelProgress: (levelId, progress) => {
    UserStorage.updateLevelProgress(levelId, progress);
    const save = UserStorage.getSaveData();
    set({
      levelProgress: save.levelProgress,
      totalStats: save.totalStats,
    });
  },

  addTotalStats: (stats) => {
    UserStorage.addStats(stats);
    const save = UserStorage.getSaveData();
    set({
      totalStats: save.totalStats,
    });
  },

  resetProgress: () => {
    UserStorage.resetProgress();
    const save = UserStorage.getSaveData();
    set({
      levelProgress: save.levelProgress,
      totalStats: save.totalStats,
    });
  },

  isLevelUnlocked: (levelId) => {
    return UserStorage.isLevelUnlocked(levelId);
  },
}));
