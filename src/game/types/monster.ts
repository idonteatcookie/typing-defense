import type { MonsterType, Point } from './game';

export interface MonsterConfig {
  type: MonsterType;
  name: string;
  maxHp: number;
  speed: number;
  goldReward: number;
  color: string;
  size: number;
}

export interface SlowEffect {
  amount: number;
  duration: number;
  remaining: number;
}

export interface MonsterState {
  id: string;
  type: MonsterType;
  x: number;
  y: number;
  maxHp: number;
  currentHp: number;
  speed: number;
  goldReward: number;
  pathIndex: number;
  pathProgress: number;
  active: boolean;
  slowEffects: SlowEffect[];
  color: string;
  size: number;
}
