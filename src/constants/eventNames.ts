export const EVENT_NAMES = {
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_VICTORY: 'game:victory',
  GAME_DEFEAT: 'game:defeat',

  MONSTER_SPAWN: 'monster:spawn',
  MONSTER_HIT: 'monster:hit',
  MONSTER_DEATH: 'monster:death',
  MONSTER_REACH_END: 'monster:reachEnd',
  MONSTER_NEAR_END: 'monster:nearEnd',

  TOWER_PLACE: 'tower:place',
  TOWER_SELL: 'tower:sell',
  TOWER_ATTACK: 'tower:attack',

  BULLET_FIRE: 'bullet:fire',
  BULLET_HIT: 'bullet:hit',

  TYPING_CORRECT: 'typing:correct',
  TYPING_WRONG: 'typing:wrong',
  TYPING_COMPLETE: 'typing:complete',
  TYPING_TARGET_CHANGE: 'typing:targetChange',

  GOLD_CHANGE: 'gold:change',
  LIFE_CHANGE: 'life:change',
  WAVE_START: 'wave:start',
  WAVE_COMPLETE: 'wave:complete',

  CANNON_FIRE: 'cannon:fire',
} as const;

export type EventName = typeof EVENT_NAMES[keyof typeof EVENT_NAMES];
