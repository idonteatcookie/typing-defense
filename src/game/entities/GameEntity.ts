import { generateId } from '../utils/math';

export abstract class GameEntity {
  public readonly id: string;
  public x: number;
  public y: number;
  public active: boolean = true;

  constructor(x: number, y: number, id?: string) {
    this.id = id || generateId();
    this.x = x;
    this.y = y;
  }

  abstract update(...args: any[]): any;

  destroy(): void {
    this.active = false;
  }

  reset(): void {
    this.active = false;
  }
}
