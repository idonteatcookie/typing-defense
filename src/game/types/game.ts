export interface Point {
  x: number;
  y: number;
}

export type GameState = 'idle' | 'playing' | 'paused' | 'victory' | 'defeat';

export type GameScreen = 'menu' | 'levelSelect' | 'playing' | 'paused' | 'victory' | 'defeat';

export type TowerType = 'arrow' | 'magic' | 'ice' | 'sniper' | 'gold';

export type MonsterType = 'slime' | 'runner' | 'tank' | 'boss';

export type AttackType = 'single' | 'aoe';

export type TypingEngineType = 'qwerty' | 'shuangpin' | 'wubi';

export type Difficulty = 'easy' | 'normal' | 'hard';
