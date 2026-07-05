import type { TowerType, AttackType, Point } from './game';

export interface TowerConfig {
  type: TowerType;
  name: string;
  cost: number;
  damage: number;
  attackSpeed: number;
  range: number;
  attackType: AttackType;
  aoeRadius?: number;
  color: string;
  description: string;
  slowAmount?: number;
  slowDuration?: number;
  goldPerTick?: number;
  tickInterval?: number;
  sprite?: string;
  sound?: string;
}

export interface TowerState {
  id: string;
  type: TowerType;
  gridX: number;
  gridY: number;
  x: number;
  y: number;
  damage: number;
  attackSpeed: number;
  range: number;
  attackType: AttackType;
  attackCooldown: number;
  cost: number;
  active: boolean;
  color: string;
  name: string;
}
