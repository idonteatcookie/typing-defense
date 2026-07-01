import { GameEntity } from './GameEntity';
import type { MonsterType, Point } from '../types/game';
import type { MonsterState, SlowEffect } from '../types/monster';
import { getMonsterConfig } from '../config/MonsterConfig';
import { generateId } from '../utils/math';

export class Monster extends GameEntity {
  public type: MonsterType;
  public maxHp: number;
  public currentHp: number;
  public speed: number;
  public baseSpeed: number;
  public goldReward: number;
  public color: string;
  public size: number;

  public pathIndex: number = 0;
  public pathProgress: number = 0;
  public totalProgress: number = 0;
  private slowEffects: SlowEffect[] = [];

  private path: Point[] = [];

  constructor(
    type: MonsterType,
    x: number,
    y: number,
    path: Point[],
    id?: string
  ) {
    super(x, y, id);
    const config = getMonsterConfig(type);
    this.type = type;
    this.maxHp = config.maxHp;
    this.currentHp = config.maxHp;
    this.baseSpeed = config.speed;
    this.speed = config.speed;
    this.goldReward = config.goldReward;
    this.color = config.color;
    this.size = config.size;
    this.path = path;
  }

  update(deltaTime: number): void {
    if (!this.active) return;

    this.updateSlowEffects(deltaTime);
    this.speed = this.calculateCurrentSpeed();

    const reachedEnd = this.moveAlongPath(deltaTime);
    if (reachedEnd) {
      this.active = false;
    }
  }

  private moveAlongPath(deltaTime: number): boolean {
    if (this.pathIndex >= this.path.length - 1) {
      return true;
    }

    const current = this.path[this.pathIndex];
    const next = this.path[this.pathIndex + 1];
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    const moveDistance = this.speed * deltaTime;
    this.pathProgress += moveDistance;

    while (this.pathProgress >= segmentLength && this.pathIndex < this.path.length - 1) {
      this.pathProgress -= segmentLength;
      this.pathIndex++;
      this.totalProgress += segmentLength;

      if (this.pathIndex >= this.path.length - 1) {
        this.x = this.path[this.path.length - 1].x;
        this.y = this.path[this.path.length - 1].y;
        return true;
      }
    }

    if (this.pathIndex < this.path.length - 1) {
      const curr = this.path[this.pathIndex];
      const nxt = this.path[this.pathIndex + 1];
      const segLen = Math.sqrt((nxt.x - curr.x) ** 2 + (nxt.y - curr.y) ** 2);
      const t = segLen > 0 ? this.pathProgress / segLen : 0;
      this.x = curr.x + (nxt.x - curr.x) * t;
      this.y = curr.y + (nxt.y - curr.y) * t;
    }

    return false;
  }

  takeDamage(damage: number): boolean {
    this.currentHp -= damage;
    if (this.currentHp <= 0) {
      this.currentHp = 0;
      this.active = false;
      return true;
    }
    return false;
  }

  applySlow(amount: number, duration: number): void {
    this.slowEffects.push({
      amount,
      duration,
      remaining: duration,
    });
  }

  private updateSlowEffects(deltaTime: number): void {
    this.slowEffects = this.slowEffects.filter(effect => {
      effect.remaining -= deltaTime;
      return effect.remaining > 0;
    });
  }

  private calculateCurrentSpeed(): number {
    if (this.slowEffects.length === 0) return this.baseSpeed;

    const maxSlow = Math.max(...this.slowEffects.map(e => e.amount));
    return this.baseSpeed * (1 - maxSlow);
  }

  getProgress(): number {
    return this.totalProgress + this.pathProgress;
  }

  getState(): MonsterState {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      maxHp: this.maxHp,
      currentHp: this.currentHp,
      speed: this.speed,
      goldReward: this.goldReward,
      pathIndex: this.pathIndex,
      pathProgress: this.pathProgress,
      active: this.active,
      slowEffects: [...this.slowEffects],
      color: this.color,
      size: this.size,
    };
  }

  reset(): void {
    super.reset();
    this.currentHp = this.maxHp;
    this.pathIndex = 0;
    this.pathProgress = 0;
    this.totalProgress = 0;
    this.slowEffects = [];
    this.speed = this.baseSpeed;
  }

  setPath(path: Point[]): void {
    this.path = path;
  }
}
