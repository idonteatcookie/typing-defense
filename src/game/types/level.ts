import type { Point, TowerType, MonsterType } from './game';

export interface LevelConfig {
  id: number;
  name: string;
  startGold: number;
  startLives: number;
  path: Point[];
  availableTowers: TowerType[];
  waves: WaveConfig[];
  typingDifficulty: number;
}

export interface WaveConfig {
  delay: number;
  monsters: MonsterSpawn[];
}

export interface MonsterSpawn {
  type: MonsterType;
  count: number;
  interval: number;
}
