import { Monster } from '../entities/Monster';
import type { MonsterType, Point } from '../types/game';
import { eventBus } from '../EventBus';
import { EVENT_NAMES } from '@/constants/eventNames';
import { distance } from '../utils/math';

export class MonsterSystem {
  private monsters: Monster[] = [];
  private path: Point[] = [];

  setPath(path: Point[]): void {
    this.path = path;
  }

  spawnMonster(type: MonsterType): Monster {
    const startPoint = this.path[0];
    const monster = new Monster(type, startPoint.x, startPoint.y, this.path);
    this.monsters.push(monster);
    eventBus.emit(EVENT_NAMES.MONSTER_SPAWN, monster.getState());
    return monster;
  }

  update(deltaTime: number): { reachedEnd: Monster[]; died: Monster[] } {
    const reachedEnd: Monster[] = [];
    const died: Monster[] = [];

    for (const monster of this.monsters) {
      if (!monster.active) continue;

      const wasActive = monster.active;
      monster.update(deltaTime);

      if (wasActive && !monster.active) {
        if (monster.currentHp <= 0) {
          died.push(monster);
          eventBus.emit(EVENT_NAMES.MONSTER_DEATH, monster.getState());
        } else {
          reachedEnd.push(monster);
          eventBus.emit(EVENT_NAMES.MONSTER_REACH_END, monster.getState());
        }
      }
    }

    this.monsters = this.monsters.filter(m => m.active);

    return { reachedEnd, died };
  }

  getMonsters(): Monster[] {
    return this.monsters.filter(m => m.active);
  }

  getMonsterById(id: string): Monster | undefined {
    return this.monsters.find(m => m.id === id && m.active);
  }

  getMonstersInRange(x: number, y: number, range: number): Monster[] {
    return this.monsters.filter(m => {
      if (!m.active) return false;
      return distance(x, y, m.x, m.y) <= range;
    });
  }

  getSortedByProgress(): Monster[] {
    return [...this.monsters]
      .filter(m => m.active)
      .sort((a, b) => b.getProgress() - a.getProgress());
  }

  getFrontMonster(): Monster | null {
    const sorted = this.getSortedByProgress();
    return sorted.length > 0 ? sorted[0] : null;
  }

  getActiveCount(): number {
    return this.monsters.filter(m => m.active).length;
  }

  damageMonster(id: string, damage: number): { died: boolean; monster?: Monster } {
    const monster = this.getMonsterById(id);
    if (!monster) return { died: false };

    const died = monster.takeDamage(damage);
    eventBus.emit(EVENT_NAMES.MONSTER_HIT, {
      monster: monster.getState(),
      damage,
    });

    if (died) {
      eventBus.emit(EVENT_NAMES.MONSTER_DEATH, monster.getState());
    }

    return { died, monster };
  }

  clear(): void {
    this.monsters = [];
  }
}
