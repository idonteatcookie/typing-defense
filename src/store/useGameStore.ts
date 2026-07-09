import { create } from 'zustand';
import type { GameScreen, TowerType } from '@/game/types/game';
import type { TypingTarget, TypingStats } from '@/game/types/typing';
import type { VictoryData, DefeatData } from '@/game/EventBus';

interface GameStore {
  gameScreen: GameScreen;
  currentLevelId: number | null;
  gold: number;
  lives: number;
  score: number;
  kills: number;
  currentWave: number;
  totalWaves: number;
  currentTypingTarget: TypingTarget | null;
  combo: number;
  accuracy: number;
  wpm: number;
  placingTowerType: TowerType | null;
  selectedTowerId: string | null;
  speedMultiplier: number;

  victoryData: VictoryData | null;
  defeatData: DefeatData | null;

  setGameScreen: (screen: GameScreen) => void;
  setCurrentLevelId: (id: number | null) => void;
  setGold: (gold: number) => void;
  setLives: (lives: number) => void;
  setScore: (score: number) => void;
  setKills: (kills: number) => void;
  setWave: (current: number, total: number) => void;
  setTypingTarget: (target: TypingTarget | null) => void;
  setCombo: (combo: number) => void;
  updateStats: (stats: Partial<TypingStats>) => void;

  startPlacingTower: (type: TowerType) => void;
  cancelPlacingTower: () => void;
  setSelectedTower: (id: string | null) => void;

  setVictory: (data: VictoryData) => void;
  setDefeat: (data: DefeatData) => void;
  resetResult: () => void;

  toggleSpeedMultiplier: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameScreen: 'menu',
  currentLevelId: null,
  gold: 100,
  lives: 10,
  score: 0,
  kills: 0,
  currentWave: 0,
  totalWaves: 0,
  currentTypingTarget: null,
  combo: 0,
  accuracy: 1,
  wpm: 0,
  placingTowerType: null,
  selectedTowerId: null,
  speedMultiplier: 1,
  victoryData: null,
  defeatData: null,

  setGameScreen: (screen) => set({ gameScreen: screen }),
  setCurrentLevelId: (id) => set({ currentLevelId: id }),
  setGold: (gold) => set({ gold }),
  setLives: (lives) => set({ lives }),
  setScore: (score) => set({ score }),
  setKills: (kills) => set({ kills }),
  setWave: (current, total) => set({ currentWave: current, totalWaves: total }),
  setTypingTarget: (target) => set({ currentTypingTarget: target }),
  setCombo: (combo) => set({ combo }),
  updateStats: (stats) => set((state) => ({
    accuracy: stats.accuracy ?? state.accuracy,
    wpm: stats.wpm ?? state.wpm,
    combo: stats.combo ?? state.combo,
  })),

  startPlacingTower: (type) => set({ placingTowerType: type, selectedTowerId: null }),
  cancelPlacingTower: () => set({ placingTowerType: null }),
  setSelectedTower: (id) => set({ selectedTowerId: id, placingTowerType: null }),

  setVictory: (data) => set({ gameScreen: 'victory', victoryData: data }),
  setDefeat: (data) => set({ gameScreen: 'defeat', defeatData: data }),
  resetResult: () => set({ victoryData: null, defeatData: null }),

  toggleSpeedMultiplier: () => set((state) => ({
    speedMultiplier: state.speedMultiplier === 1 ? 2 : 1,
  })),
}));
