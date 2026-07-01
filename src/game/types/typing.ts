import type { TypingEngineType } from './game';

export interface ITypingEngine {
  readonly type: TypingEngineType;
  generateTarget(difficulty: number, levelId?: number): TypingTarget;
  inputChar(target: TypingTarget, char: string): TypingInputResult;
  getDisplayText(target: TypingTarget): TypingDisplayText;
  resetProgress(target: TypingTarget): void;
  loadDictionary?(levelId?: number): Promise<void>;
}

export interface TypingTarget {
  id: string;
  engineType: TypingEngineType;
  displayText: string;
  inputSequence: string;
  currentIndex: number;
  isComplete: boolean;
  difficulty: number;
}

export interface TypingInputResult {
  success: boolean;
  complete: boolean;
  progress: number;
  currentIndex: number;
  typedChar: string;
  correctChar: string;
}

export interface TypingDisplayText {
  before: string;
  current: string;
  after: string;
}

export interface TypingStats {
  combo: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  wpm: number;
}

export interface TypingResult extends TypingInputResult {
  combo: number;
}
