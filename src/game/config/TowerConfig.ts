import type { TowerConfig } from '../types/tower';
import type { TowerType } from '../types/game';
import towersData from '../../data/towers.json';

export const TOWER_CONFIGS: Record<string, TowerConfig> = {};

for (const tower of towersData) {
  TOWER_CONFIGS[tower.type] = tower as TowerConfig;
}

export function getTowerConfig(type: TowerType): TowerConfig {
  return TOWER_CONFIGS[type];
}

export function getAllTowerConfigs(): TowerConfig[] {
  return towersData as TowerConfig[];
}
