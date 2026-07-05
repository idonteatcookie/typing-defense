import type { ITypingEngine, TypingTarget, TypingInputResult, TypingDisplayText } from '../types/typing';
import { generateId } from '../utils/math';
import wordsData from '../../data/words.json';

export class WordEngine implements ITypingEngine {
  public readonly type = 'word' as const;
  private words: string[] = wordsData as string[];

  generateTarget(difficulty: number): TypingTarget {
    const word = this.words[Math.floor(Math.random() * this.words.length)];
    return {
      id: generateId(),
      engineType: 'qwerty',
      displayText: word.toUpperCase(),
      inputSequence: word.toLowerCase(),
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
}
