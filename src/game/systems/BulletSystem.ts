import { Bullet } from '../entities/Bullet';
import type { TowerType } from '../types/game';
import type { Monster } from '../entities/Monster';
import { eventBus } from '../EventBus';
import { EVENT_NAMES } from '@/constants/eventNames';
import { getTowerConfig } from '../config/TowerConfig';

export class BulletSystem {
  private bullets: Bullet[] = [];

  fireBullet(
    x: number,
    y: number,
    targetId: string,
    targetX: number,
    targetY: number,
    damage: number,
    speed: number,
    towerType: TowerType
  ): Bullet {
    const config = getTowerConfig(towerType);
    const bullet = new Bullet(
      x,
      y,
      targetId,
      targetX,
      targetY,
      damage,
      speed,
      towerType,
      config.color,
      config.attackType === 'aoe',
      config.aoeRadius || 0
    );

    this.bullets.push(bullet);
    eventBus.emit(EVENT_NAMES.BULLET_FIRE, bullet.getState());
    return bullet;
  }

  update(deltaTime: number, monsters: Monster[]): {
    hits: { bullet: Bullet; hitMonsterIds: string[] }[];
  } {
    const hits: { bullet: Bullet; hitMonsterIds: string[] }[] = [];

    for (const bullet of this.bullets) {
      if (!bullet.active) continue;

      const result = bullet.update(deltaTime, monsters);
      if (result.hit) {
        hits.push({ bullet, hitMonsterIds: result.hitMonsterIds });
        eventBus.emit(EVENT_NAMES.BULLET_HIT, {
          bullet: bullet.getState(),
          monsterIds: result.hitMonsterIds,
        });
      }
    }

    this.bullets = this.bullets.filter(b => b.active);

    return { hits };
  }

  getBullets(): Bullet[] {
    return this.bullets.filter(b => b.active);
  }

  clear(): void {
    this.bullets = [];
  }
}
