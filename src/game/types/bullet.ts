import type { TowerType } from './game';

export interface BulletState {
  id: string;
  x: number;
  y: number;
  targetId: string;
  damage: number;
  speed: number;
  towerType: TowerType;
  isAoe: boolean;
  aoeRadius: number;
  active: boolean;
  color: string;
}

export interface BulletHitResult {
  hit: boolean;
  hitMonsterIds: string[];
}
