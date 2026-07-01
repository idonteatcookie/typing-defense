import type { MonsterConfig } from '../types/monster';
import type { MonsterType } from '../types/game';

export const MONSTER_CONFIGS: Record<MonsterType, MonsterConfig> = {
  slime: {
    type: 'slime',
    name: '史莱姆',
    maxHp: 30,
    speed: 30,
    goldReward: 5,
    color: '#4ade80',
    size: 20,
  },
  runner: {
    type: 'runner',
    name: '疾行者',
    maxHp: 20,
    speed: 60,
    goldReward: 8,
    color: '#fbbf24',
    size: 16,
  },
  tank: {
    type: 'tank',
    name: '重甲兵',
    maxHp: 100,
    speed: 20,
    goldReward: 15,
    color: '#94a3b8',
    size: 28,
  },
  boss: {
    type: 'boss',
    name: 'Boss',
    maxHp: 500,
    speed: 15,
    goldReward: 100,
    color: '#ef4444',
    size: 40,
  },
};

export function getMonsterConfig(type: MonsterType): MonsterConfig {
  return MONSTER_CONFIGS[type];
}
