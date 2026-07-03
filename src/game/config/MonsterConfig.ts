import type { MonsterConfig } from '../types/monster';
import type { MonsterType } from '../types/game';
import monstersData from '../../data/monsters.json';

export const MONSTER_CONFIGS: Record<string, MonsterConfig> = {};

for (const monster of monstersData) {
  MONSTER_CONFIGS[monster.type] = monster as MonsterConfig;
}

export function getMonsterConfig(type: MonsterType): MonsterConfig {
  return MONSTER_CONFIGS[type];
}

export function getAllMonsterConfigs(): MonsterConfig[] {
  return monstersData as MonsterConfig[];
}
