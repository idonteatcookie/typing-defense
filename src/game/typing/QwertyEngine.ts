import type { ITypingEngine, TypingTarget, TypingInputResult, TypingDisplayText } from '../types/typing';
import type { TypingEngineType } from '../types/game';
import { generateId, randomChoice, randomInt } from '../utils/math';

export class QwertyEngine implements ITypingEngine {
  public readonly type: TypingEngineType = 'qwerty';

  private easyLetters = 'asdfjkl;';
  private mediumLetters = 'asdfghjkl;qwertyuiop';
  private hardLetters = 'abcdefghijklmnopqrstuvwxyz';

  generateTarget(difficulty: number, levelId?: number, practiceLetters?: string): TypingTarget {
    const length = this.getLengthByDifficulty(difficulty);
    const letters = practiceLetters || this.getLetterSet(difficulty);
    const text = this.generateRandomText(length, letters);

    return {
      id: generateId(),
      engineType: 'qwerty',
      displayText: text.toUpperCase(),
      inputSequence: text.toLowerCase(),
      currentIndex: 0,
      isComplete: false,
      difficulty,
    };
  }

  inputChar(target: TypingTarget, char: string): TypingInputResult {
    const lowerChar = char.toLowerCase();
    const expectedChar = target.inputSequence[target.currentIndex] || '';
    const isCorrect = lowerChar === expectedChar;

    if (isCorrect && !target.isComplete) {
      target.currentIndex++;
      target.isComplete = target.currentIndex >= target.inputSequence.length;
    }

    return {
      success: isCorrect,
      complete: target.isComplete,
      progress: target.inputSequence.length > 0
        ? target.currentIndex / target.inputSequence.length
        : 1,
      currentIndex: target.currentIndex,
      typedChar: char,
      correctChar: expectedChar,
    };
  }

  getDisplayText(target: TypingTarget): TypingDisplayText {
    const seq = target.displayText;
    return {
      before: seq.slice(0, target.currentIndex),
      current: seq[target.currentIndex] || '',
      after: seq.slice(target.currentIndex + 1),
    };
  }

  resetProgress(target: TypingTarget): void {
    target.currentIndex = 0;
    target.isComplete = false;
  }

  private getLengthByDifficulty(difficulty: number): number {
    return 1;
  }

  private getLetterSet(difficulty: number): string {
    if (difficulty <= 2) return this.easyLetters;
    if (difficulty <= 5) return this.mediumLetters;
    return this.hardLetters;
  }

  private generateRandomText(length: number, letters: string): string {
    let text = '';
    for (let i = 0; i < length; i++) {
      text += letters[Math.floor(Math.random() * letters.length)];
    }
    return text;
  }
}
