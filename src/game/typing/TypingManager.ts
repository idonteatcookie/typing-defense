import type { ITypingEngine, TypingTarget, TypingResult, TypingStats, TypingDisplayText } from '../types/typing';
import type { TypingEngineType } from '../types/game';
import { EngineFactory } from './EngineFactory';
import { eventBus } from '../EventBus';
import { EVENT_NAMES } from '@/constants/eventNames';

export class TypingManager {
  private engine: ITypingEngine;
  private currentTarget: TypingTarget | null = null;
  private combo: number = 0;
  private totalKeystrokes: number = 0;
  private correctKeystrokes: number = 0;
  private startTime: number = 0;

  constructor(engineType: TypingEngineType = 'qwerty') {
    this.engine = EngineFactory.getEngine(engineType);
  }

  switchEngine(type: TypingEngineType): void {
    this.engine = EngineFactory.getEngine(type);
    this.reset();
  }

  newTarget(difficulty: number, levelId?: number): TypingTarget {
    this.currentTarget = this.engine.generateTarget(difficulty, levelId);
    eventBus.emit(EVENT_NAMES.TYPING_TARGET_CHANGE, this.currentTarget);
    return this.currentTarget;
  }

  handleInput(char: string): TypingResult {
    if (!this.currentTarget) {
      return {
        success: false,
        complete: false,
        progress: 0,
        currentIndex: 0,
        typedChar: char,
        correctChar: '',
        combo: 0,
      };
    }

    if (this.startTime === 0) {
      this.startTime = Date.now();
    }

    this.totalKeystrokes++;
    const result = this.engine.inputChar(this.currentTarget, char);

    if (result.success) {
      this.correctKeystrokes++;
      this.combo++;
      eventBus.emit(EVENT_NAMES.TYPING_CORRECT, { char, combo: this.combo });

      if (result.complete) {
        eventBus.emit(EVENT_NAMES.TYPING_COMPLETE, {
          target: this.currentTarget,
          combo: this.combo,
        });
      }
    } else {
      this.combo = 0;
      eventBus.emit(EVENT_NAMES.TYPING_WRONG, { char });
    }

    return {
      ...result,
      combo: this.combo,
    };
  }

  getCurrentTarget(): TypingTarget | null {
    return this.currentTarget;
  }

  getDisplayText(): TypingDisplayText | null {
    if (!this.currentTarget) return null;
    return this.engine.getDisplayText(this.currentTarget);
  }

  getStats(): TypingStats {
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    const wpm = elapsedMinutes > 0
      ? Math.round(this.correctKeystrokes / 5 / elapsedMinutes)
      : 0;

    return {
      combo: this.combo,
      accuracy: this.totalKeystrokes > 0
        ? this.correctKeystrokes / this.totalKeystrokes
        : 1,
      totalKeystrokes: this.totalKeystrokes,
      correctKeystrokes: this.correctKeystrokes,
      wpm,
    };
  }

  getCombo(): number {
    return this.combo;
  }

  getComboDamageMultiplier(): number {
    if (this.combo >= 50) return 2.0;
    if (this.combo >= 20) return 1.5;
    if (this.combo >= 10) return 1.25;
    if (this.combo >= 5) return 1.1;
    return 1.0;
  }

  reset(): void {
    this.currentTarget = null;
    this.combo = 0;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.startTime = 0;
    eventBus.emit(EVENT_NAMES.TYPING_TARGET_CHANGE, null);
  }

  clearTarget(): void {
    this.currentTarget = null;
    eventBus.emit(EVENT_NAMES.TYPING_TARGET_CHANGE, null);
  }
}
