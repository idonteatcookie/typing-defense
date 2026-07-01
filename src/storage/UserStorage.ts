import { StorageService, StorageKey } from './StorageService';
import type { GameSaveData, LevelProgress, TotalStats, LevelProgressMap } from './schema';
import { STORAGE_VERSION } from './schema';

export class UserStorage {
  static getSaveData(): GameSaveData {
    return StorageService.get<GameSaveData>(
      StorageKey.GameSave,
      this.createDefaultSave()
    );
  }

  static saveGameData(data: GameSaveData): void {
    data.updatedAt = Date.now();
    StorageService.set(StorageKey.GameSave, data);
  }

  static updateLevelProgress(
    levelId: number,
    progress: Partial<LevelProgress>
  ): void {
    const save = this.getSaveData();
    const current = save.levelProgress[levelId] || {
      unlocked: levelId === 1,
      completed: false,
      stars: 0,
      bestScore: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      playCount: 0,
      lastPlayedAt: 0,
    };

    save.levelProgress[levelId] = {
      ...current,
      ...progress,
      playCount: current.playCount + 1,
      lastPlayedAt: Date.now(),
    };

    if (progress.completed) {
      const nextLevelId = levelId + 1;
      if (!save.levelProgress[nextLevelId]) {
        save.levelProgress[nextLevelId] = {
          unlocked: true,
          completed: false,
          stars: 0,
          bestScore: 0,
          bestWpm: 0,
          bestAccuracy: 0,
          playCount: 0,
          lastPlayedAt: 0,
        };
      } else {
        save.levelProgress[nextLevelId].unlocked = true;
      }
      if (nextLevelId > save.totalStats.maxLevelUnlocked) {
        save.totalStats.maxLevelUnlocked = nextLevelId;
      }
    }

    this.saveGameData(save);
  }

  static addStats(stats: Partial<TotalStats>): void {
    const save = this.getSaveData();
    Object.keys(stats).forEach(key => {
      const k = key as keyof TotalStats;
      const val = stats[k];
      if (typeof save.totalStats[k] === 'number' && typeof val === 'number') {
        (save.totalStats[k] as number) += val;
      }
    });
    this.saveGameData(save);
  }

  static getLevelProgress(levelId: number): LevelProgress | null {
    const save = this.getSaveData();
    return save.levelProgress[levelId] || null;
  }

  static isLevelUnlocked(levelId: number): boolean {
    if (levelId === 1) return true;
    const save = this.getSaveData();
    return save.levelProgress[levelId]?.unlocked || false;
  }

  static getMaxUnlockedLevel(): number {
    const save = this.getSaveData();
    return save.totalStats.maxLevelUnlocked || 1;
  }

  static resetProgress(): void {
    StorageService.remove(StorageKey.GameSave);
  }

  private static createDefaultSave(): GameSaveData {
    const levelProgress: LevelProgressMap = {
      1: {
        unlocked: true,
        completed: false,
        stars: 0,
        bestScore: 0,
        bestWpm: 0,
        bestAccuracy: 0,
        playCount: 0,
        lastPlayedAt: 0,
      },
    };

    return {
      version: STORAGE_VERSION,
      updatedAt: Date.now(),
      levelProgress,
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
    };
  }
}
