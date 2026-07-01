import { Tower, TowerFactory, GoldTower } from '../entities/Tower';
import type { TowerType, Point } from '../types/game';
import type { Monster } from '../entities/Monster';
import { eventBus } from '../EventBus';
import { EVENT_NAMES } from '@/constants/eventNames';
import { isOnPath, gridToWorld } from '../utils/grid';
import { GRID_COLS, GRID_ROWS } from '@/constants/gameConstants';
import { getTowerConfig } from '../config/TowerConfig';

export class TowerSystem {
  private towers: Tower[] = [];
  private path: Point[] = [];
  private occupiedCells: Set<string> = new Set();

  setPath(path: Point[]): void {
    this.path = path;
  }

  canPlaceAt(gridX: number, gridY: number): boolean {
    if (gridX < 0 || gridX >= GRID_COLS || gridY < 0 || gridY >= GRID_ROWS) {
      return false;
    }

    if (this.occupiedCells.has(`${gridX},${gridY}`)) {
      return false;
    }

    if (isOnPath(gridX, gridY, this.path, 1)) {
      return false;
    }

    return true;
  }

  placeTower(type: TowerType, gridX: number, gridY: number): Tower | null {
    if (!this.canPlaceAt(gridX, gridY)) {
      return null;
    }

    const tower = TowerFactory.create(type, gridX, gridY);
    this.towers.push(tower);
    this.occupiedCells.add(`${gridX},${gridY}`);
    eventBus.emit(EVENT_NAMES.TOWER_PLACE, tower.getState());
    return tower;
  }

  sellTower(towerId: string): number {
    const index = this.towers.findIndex(t => t.id === towerId);
    if (index === -1) return 0;

    const tower = this.towers[index];
    const refund = tower.getSellValue();
    this.occupiedCells.delete(`${tower.gridX},${tower.gridY}`);
    this.towers.splice(index, 1);
    eventBus.emit(EVENT_NAMES.TOWER_SELL, tower.getState());
    return refund;
  }

  update(deltaTime: number, monsters: Monster[]): {
    attacks: { tower: Tower; targets: Monster[] }[];
    goldGenerated: number;
  } {
    const attacks: { tower: Tower; targets: Monster[] }[] = [];
    let goldGenerated = 0;

    for (const tower of this.towers) {
      if (!tower.active) continue;

      if (tower instanceof GoldTower) {
        tower.update(deltaTime);
        goldGenerated += tower.getGoldGenerated();
        continue;
      }

      const targets = tower.update(deltaTime, monsters);
      if (targets && targets.length > 0) {
        attacks.push({ tower, targets });
        eventBus.emit(EVENT_NAMES.TOWER_ATTACK, {
          tower: tower.getState(),
          targetId: targets[0].id,
        });
      }
    }

    return { attacks, goldGenerated };
  }

  getTowers(): Tower[] {
    return this.towers.filter(t => t.active);
  }

  getTowerAt(gridX: number, gridY: number): Tower | undefined {
    return this.towers.find(t => t.gridX === gridX && t.gridY === gridY && t.active);
  }

  getTowerById(id: string): Tower | undefined {
    return this.towers.find(t => t.id === id && t.active);
  }

  getTowerConfig(type: TowerType) {
    return getTowerConfig(type);
  }

  clear(): void {
    this.towers = [];
    this.occupiedCells.clear();
  }
}
