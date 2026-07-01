import type { ITypingEngine, TypingEngineType } from '../types/typing';
import type { TypingEngineType as EngineType } from '../types/game';
import { QwertyEngine } from './QwertyEngine';

export class EngineFactory {
  private static engines: Map<EngineType, ITypingEngine> = new Map();

  static getEngine(type: EngineType): ITypingEngine {
    if (!this.engines.has(type)) {
      const engine = this.createEngine(type);
      this.engines.set(type, engine);
    }
    return this.engines.get(type)!;
  }

  private static createEngine(type: EngineType): ITypingEngine {
    switch (type) {
      case 'qwerty':
        return new QwertyEngine();
      case 'shuangpin':
        return new QwertyEngine();
      case 'wubi':
        return new QwertyEngine();
      default:
        return new QwertyEngine();
    }
  }

  static registerEngine(type: EngineType, engine: ITypingEngine): void {
    this.engines.set(type, engine);
  }
}
