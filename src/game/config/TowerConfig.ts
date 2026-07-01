import type { TowerConfig } from '../types/tower';
import type { TowerType } from '../types/game';

export const TOWER_CONFIGS: Record<TowerType, TowerConfig> = {
  arrow: {
    type: 'arrow',
    name: '箭塔',
    cost: 50,
    damage: 10,
    attackSpeed: 1.0,
    range: 120,
    attackType: 'single',
    color: '#8b5cf6',
    description: '基础防御塔，单体攻击，性价比高',
  },
  magic: {
    type: 'magic',
    name: '魔法塔',
    cost: 100,
    damage: 25,
    attackSpeed: 0.5,
    range: 100,
    attackType: 'aoe',
    aoeRadius: 50,
    color: '#06b6d4',
    description: '范围伤害，对付密集怪物群',
  },
  ice: {
    type: 'ice',
    name: '冰霜塔',
    cost: 80,
    damage: 5,
    attackSpeed: 0.8,
    range: 110,
    attackType: 'single',
    color: '#3b82f6',
    description: '减速敌人，控制型防御塔',
    slowAmount: 0.3,
    slowDuration: 2,
  },
  sniper: {
    type: 'sniper',
    name: '狙击塔',
    cost: 150,
    damage: 80,
    attackSpeed: 0.3,
    range: 200,
    attackType: 'single',
    color: '#f97316',
    description: '超远射程，高伤害，攻速慢',
  },
  gold: {
    type: 'gold',
    name: '金币塔',
    cost: 120,
    damage: 0,
    attackSpeed: 0,
    range: 0,
    attackType: 'single',
    color: '#fbbf24',
    description: '不攻击，定期产生金币',
    goldPerTick: 5,
    tickInterval: 5,
  },
};

export function getTowerConfig(type: TowerType): TowerConfig {
  return TOWER_CONFIGS[type];
}
