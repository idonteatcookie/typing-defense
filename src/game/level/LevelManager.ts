import type { LevelConfig, WaveConfig, MonsterSpawn } from '../types/level';
import type { MonsterType } from '../types/game';
import levelsData from '../../data/levels.json';

export class LevelManager {
  private levels: LevelConfig[] = [];
  private currentLevel: LevelConfig | null = null;

  constructor() {
    this.levels = levelsData as LevelConfig[];
  }

  getLevels(): LevelConfig[] {
    return this.levels;
  }

  getLevel(levelId: number): LevelConfig | undefined {
    return this.levels.find(l => l.id === levelId);
  }

  loadLevel(levelId: number): LevelConfig {
    const level = this.levels.find(l => l.id === levelId);
    if (!level) {
      throw new Error(`Level ${levelId} not found`);
    }
    this.currentLevel = level;
    return level;
  }

  getCurrentLevel(): LevelConfig | null {
    return this.currentLevel;
  }

  getPath(): { x: number; y: number }[] {
    return this.currentLevel?.path || [];
  }

  getAvailableTowers(): string[] {
    return this.currentLevel?.availableTowers || [];
  }

  getStartGold(): number {
    return this.currentLevel?.startGold || 100;
  }

  getStartLives(): number {
    return this.currentLevel?.startLives || 10;
  }

  getWaves(): WaveConfig[] {
    return this.currentLevel?.waves || [];
  }

  getTotalWaves(): number {
    return this.currentLevel?.waves.length || 0;
  }

  getTypingDifficulty(): number {
    return this.currentLevel?.typingDifficulty || 1;
  }

  getPracticeLetters(): string | undefined {
    return this.currentLevel?.practiceLetters;
  }

  isEndless(): boolean {
    return this.currentLevel?.isEndless || false;
  }

  hasLevel(levelId: number): boolean {
    return this.levels.some(l => l.id === levelId);
  }

  getMaxLevel(): number {
    return Math.max(...this.levels.map(l => l.id));
  }
}
