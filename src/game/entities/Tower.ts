import { GameEntity } from './GameEntity';
import type { TowerType, AttackType, Point } from '../types/game';
import type { TowerState } from '../types/tower';
import { getTowerConfig } from '../config/TowerConfig';
import { gridToWorld } from '../utils/grid';
import { distance } from '../utils/math';
import type { Monster } from './Monster';

export abstract class Tower extends GameEntity {
  public type: TowerType;
  public damage: number;
  public attackSpeed: number;
  public range: number;
  public attackType: AttackType;
  public aoeRadius: number = 0;
  public cost: number;
  public color: string;
  public name: string;

  public attackCooldown: number = 0;
  public gridX: number;
  public gridY: number;

  protected currentTarget: Monster | null = null;

  constructor(type: TowerType, gridX: number, gridY: number, id?: string) {
    const pos = gridToWorld(gridX, gridY);
    super(pos.x, pos.y, id);
    const config = getTowerConfig(type);
    this.type = type;
    this.damage = config.damage;
    this.attackSpeed = config.attackSpeed;
    this.range = config.range;
    this.attackType = config.attackType;
    this.aoeRadius = config.aoeRadius || 0;
    this.cost = config.cost;
    this.color = config.color;
    this.name = config.name;
    this.gridX = gridX;
    this.gridY = gridY;
  }

  update(deltaTime: number, monsters: Monster[]): Monster[] | null {
    if (!this.active || this.attackSpeed <= 0) return null;

    this.attackCooldown -= deltaTime;

    if (this.attackCooldown <= 0) {
      const target = this.findTarget(monsters);
      if (target) {
        this.currentTarget = target;
        this.attackCooldown = 1 / this.attackSpeed;
        return this.attack(target);
      }
    }

    return null;
  }

  protected findTarget(monsters: Monster[]): Monster | null {
    let bestTarget: Monster | null = null;
    let bestProgress = -1;

    for (const monster of monsters) {
      if (!monster.active) continue;
      const dist = distance(this.x, this.y, monster.x, monster.y);
      if (dist <= this.range) {
        const progress = monster.getProgress();
        if (progress > bestProgress) {
          bestProgress = progress;
          bestTarget = monster;
        }
      }
    }

    return bestTarget;
  }

  protected abstract attack(target: Monster): Monster[] | null;

  getState(): TowerState {
    return {
      id: this.id,
      type: this.type,
      gridX: this.gridX,
      gridY: this.gridY,
      x: this.x,
      y: this.y,
      damage: this.damage,
      attackSpeed: this.attackSpeed,
      range: this.range,
      attackType: this.attackType,
      attackCooldown: this.attackCooldown,
      cost: this.cost,
      active: this.active,
      color: this.color,
      name: this.name,
    };
  }

  reset(): void {
    super.reset();
    this.attackCooldown = 0;
    this.currentTarget = null;
  }

  getSellValue(): number {
    return Math.floor(this.cost * 0.7);
  }
}

export class ArrowTower extends Tower {
  constructor(gridX: number, gridY: number, id?: string) {
    super('arrow', gridX, gridY, id);
  }

  protected attack(target: Monster): Monster[] {
    return [target];
  }
}

export class MagicTower extends Tower {
  constructor(gridX: number, gridY: number, id?: string) {
    super('magic', gridX, gridY, id);
  }

  protected attack(target: Monster, allMonsters?: Monster[]): Monster[] {
    return [target];
  }
}

export class IceTower extends Tower {
  public slowAmount: number;
  public slowDuration: number;

  constructor(gridX: number, gridY: number, id?: string) {
    super('ice', gridX, gridY, id);
    const config = getTowerConfig('ice');
    this.slowAmount = config.slowAmount || 0.3;
    this.slowDuration = config.slowDuration || 2;
  }

  protected attack(target: Monster): Monster[] {
    target.applySlow(this.slowAmount, this.slowDuration);
    return [target];
  }
}

export class SniperTower extends Tower {
  constructor(gridX: number, gridY: number, id?: string) {
    super('sniper', gridX, gridY, id);
  }

  protected attack(target: Monster): Monster[] {
    return [target];
  }
}

export class GoldTower extends Tower {
  public goldPerTick: number;
  public tickInterval: number;
  private tickTimer: number = 0;
  public goldGenerated: number = 0;

  constructor(gridX: number, gridY: number, id?: string) {
    super('gold', gridX, gridY, id);
    const config = getTowerConfig('gold');
    this.goldPerTick = config.goldPerTick || 5;
    this.tickInterval = config.tickInterval || 5;
  }

  update(deltaTime: number): Monster[] | null {
    if (!this.active) return null;

    this.tickTimer += deltaTime;
    if (this.tickTimer >= this.tickInterval) {
      this.tickTimer = 0;
      this.goldGenerated += this.goldPerTick;
      return null;
    }
    return null;
  }

  protected attack(): Monster[] {
    return [];
  }

  getGoldGenerated(): number {
    const gold = this.goldGenerated;
    this.goldGenerated = 0;
    return gold;
  }

  reset(): void {
    super.reset();
    this.tickTimer = 0;
    this.goldGenerated = 0;
  }
}

export class TowerFactory {
  public static create(type: TowerType, gridX: number, gridY: number): Tower {
    switch (type) {
      case 'arrow':
        return new ArrowTower(gridX, gridY);
      case 'magic':
        return new MagicTower(gridX, gridY);
      case 'ice':
        return new IceTower(gridX, gridY);
      case 'sniper':
        return new SniperTower(gridX, gridY);
      case 'gold':
        return new GoldTower(gridX, gridY);
      default:
        return new ArrowTower(gridX, gridY);
    }
  }
}
