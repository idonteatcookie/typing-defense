import { GameEntity } from './GameEntity';
import type { TowerType } from '../types/game';
import type { BulletState, BulletHitResult } from '../types/bullet';
import type { Monster } from './Monster';
import { circleHit } from '../utils/math';

export class Bullet extends GameEntity {
  public damage: number;
  public speed: number;
  public targetId: string;
  public towerType: TowerType;
  public isAoe: boolean;
  public aoeRadius: number;
  public color: string;

  private targetX: number;
  private targetY: number;
  private size: number = 6;

  constructor(
    x: number,
    y: number,
    targetId: string,
    targetX: number,
    targetY: number,
    damage: number,
    speed: number,
    towerType: TowerType,
    color: string,
    isAoe: boolean = false,
    aoeRadius: number = 0,
    id?: string
  ) {
    super(x, y, id);
    this.damage = damage;
    this.speed = speed;
    this.targetId = targetId;
    this.targetX = targetX;
    this.targetY = targetY;
    this.towerType = towerType;
    this.isAoe = isAoe;
    this.aoeRadius = aoeRadius;
    this.color = color;
  }

  update(deltaTime: number, monsters: Monster[]): BulletHitResult {
    if (!this.active) {
      return { hit: false, hitMonsterIds: [] };
    }

    const target = monsters.find(m => m.id === this.targetId && m.active);
    if (target) {
      this.targetX = target.x;
      this.targetY = target.y;
    }

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.size + 5) {
      this.active = false;
      return this.checkHit(monsters);
    }

    const moveDistance = this.speed * deltaTime;
    if (moveDistance >= dist) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.active = false;
      return this.checkHit(monsters);
    }

    this.x += (dx / dist) * moveDistance;
    this.y += (dy / dist) * moveDistance;

    if (target) {
      const hitDist = Math.sqrt(
        (this.x - target.x) ** 2 + (this.y - target.y) ** 2
      );
      if (hitDist < target.size + this.size) {
        this.active = false;
        return this.checkHit(monsters);
      }
    }

    if (this.x < -50 || this.x > 1000 || this.y < -50 || this.y > 700) {
      this.active = false;
    }

    return { hit: false, hitMonsterIds: [] };
  }

  private checkHit(monsters: Monster[]): BulletHitResult {
    const hitMonsterIds: string[] = [];

    if (this.isAoe) {
      for (const monster of monsters) {
        if (!monster.active) continue;
        const dist = Math.sqrt(
          (this.x - monster.x) ** 2 + (this.y - monster.y) ** 2
        );
        if (dist <= this.aoeRadius + monster.size) {
          hitMonsterIds.push(monster.id);
        }
      }
    } else {
      const target = monsters.find(m => m.id === this.targetId && m.active);
      if (target) {
        hitMonsterIds.push(target.id);
      } else {
        for (const monster of monsters) {
          if (!monster.active) continue;
          if (circleHit(this.x, this.y, this.size, monster.x, monster.y, monster.size)) {
            hitMonsterIds.push(monster.id);
            break;
          }
        }
      }
    }

    return {
      hit: hitMonsterIds.length > 0,
      hitMonsterIds,
    };
  }

  getState(): BulletState {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      targetId: this.targetId,
      damage: this.damage,
      speed: this.speed,
      towerType: this.towerType,
      isAoe: this.isAoe,
      aoeRadius: this.aoeRadius,
      active: this.active,
      color: this.color,
    };
  }

  reset(): void {
    super.reset();
    this.damage = 0;
    this.speed = 0;
    this.targetId = '';
    this.isAoe = false;
    this.aoeRadius = 0;
  }

  getSize(): number {
    return this.size;
  }
}
