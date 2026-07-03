import { EVENT_NAMES } from '@/constants/eventNames';
import type { EventName } from '@/constants/eventNames';
import type { MonsterState } from '../types/monster';
import type { TowerState } from '../types/tower';
import type { BulletState } from '../types/bullet';
import type { TypingTarget, TypingStats } from '../types/typing';

interface EventDataMap {
  [EVENT_NAMES.GAME_START]: void;
  [EVENT_NAMES.GAME_PAUSE]: void;
  [EVENT_NAMES.GAME_RESUME]: void;
  [EVENT_NAMES.GAME_VICTORY]: VictoryData;
  [EVENT_NAMES.GAME_DEFEAT]: DefeatData;

  [EVENT_NAMES.MONSTER_SPAWN]: MonsterState;
  [EVENT_NAMES.MONSTER_HIT]: { monster: MonsterState; damage: number };
  [EVENT_NAMES.MONSTER_DEATH]: MonsterState;
  [EVENT_NAMES.MONSTER_REACH_END]: MonsterState;
  [EVENT_NAMES.MONSTER_NEAR_END]: boolean;

  [EVENT_NAMES.TOWER_PLACE]: TowerState;
  [EVENT_NAMES.TOWER_SELL]: TowerState;
  [EVENT_NAMES.TOWER_ATTACK]: { tower: TowerState; targetId: string };

  [EVENT_NAMES.BULLET_FIRE]: BulletState;
  [EVENT_NAMES.BULLET_HIT]: { bullet: BulletState; monsterIds: string[] };

  [EVENT_NAMES.TYPING_CORRECT]: { char: string; combo: number };
  [EVENT_NAMES.TYPING_WRONG]: { char: string };
  [EVENT_NAMES.TYPING_COMPLETE]: { target: TypingTarget; combo: number };
  [EVENT_NAMES.TYPING_TARGET_CHANGE]: TypingTarget | null;

  [EVENT_NAMES.GOLD_CHANGE]: { current: number; delta: number };
  [EVENT_NAMES.LIFE_CHANGE]: { current: number; delta: number };
  [EVENT_NAMES.WAVE_START]: number;
  [EVENT_NAMES.WAVE_COMPLETE]: number;

  [EVENT_NAMES.CANNON_FIRE]: { targetId: string; damage: number };
}

export interface VictoryData {
  levelId: number;
  kills: number;
  goldEarned: number;
  stats: TypingStats;
  stars: number;
  time: number;
}

export interface DefeatData {
  levelId: number;
  kills: number;
  waveReached: number;
  stats: TypingStats;
  time: number;
}

type Handler<T> = (data: T) => void;

export class EventBus {
  private handlers: Map<string, Set<Handler<any>>> = new Map();

  on<K extends keyof EventDataMap>(
    event: K,
    handler: Handler<EventDataMap[K]>
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  emit<K extends keyof EventDataMap>(
    event: K,
    data: EventDataMap[K]
  ): void {
    this.handlers.get(event)?.forEach(handler => {
      try {
        handler(data);
      } catch (e) {
        console.error(`Error in event handler for ${event}:`, e);
      }
    });
  }

  off<K extends keyof EventDataMap>(
    event: K,
    handler: Handler<EventDataMap[K]>
  ): void {
    this.handlers.get(event)?.delete(handler);
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const eventBus = new EventBus();
