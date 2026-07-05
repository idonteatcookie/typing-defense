const fs = require('fs');
const path = require('path');

const GAME_WIDTH = 960;
const GAME_HEIGHT = 640;
const CENTER_X = GAME_WIDTH / 2;
const END_Y = GAME_HEIGHT - 40;

const maps = {
  zShape: [
    { x: CENTER_X, y: 0 },
    { x: CENTER_X, y: 160 },
    { x: 160, y: 160 },
    { x: 160, y: 400 },
    { x: 800, y: 400 },
    { x: 800, y: 560 },
    { x: CENTER_X, y: END_Y }
  ],
  sShape: [
    { x: 200, y: 0 },
    { x: 200, y: 120 },
    { x: 760, y: 120 },
    { x: 760, y: 320 },
    { x: 200, y: 320 },
    { x: 200, y: 520 },
    { x: CENTER_X, y: 520 },
    { x: CENTER_X, y: END_Y }
  ],
  uShape: [
    { x: 120, y: 0 },
    { x: 120, y: 480 },
    { x: 840, y: 480 },
    { x: 840, y: 0 },
    { x: CENTER_X, y: 0 },
    { x: CENTER_X, y: END_Y }
  ],
  snake: [
    { x: 80, y: 60 },
    { x: 880, y: 60 },
    { x: 880, y: 180 },
    { x: 80, y: 180 },
    { x: 80, y: 300 },
    { x: 880, y: 300 },
    { x: 880, y: 420 },
    { x: 80, y: 420 },
    { x: 80, y: 540 },
    { x: CENTER_X, y: 540 },
    { x: CENTER_X, y: END_Y }
  ],
  spiral: [
    { x: CENTER_X, y: 0 },
    { x: CENTER_X, y: 80 },
    { x: 840, y: 80 },
    { x: 840, y: 560 },
    { x: 120, y: 560 },
    { x: 120, y: 160 },
    { x: 720, y: 160 },
    { x: 720, y: 480 },
    { x: 240, y: 480 },
    { x: 240, y: 240 },
    { x: 600, y: 240 },
    { x: 600, y: 400 },
    { x: CENTER_X, y: 400 },
    { x: CENTER_X, y: END_Y }
  ],
  lShape: [
    { x: CENTER_X, y: 0 },
    { x: CENTER_X, y: 200 },
    { x: 120, y: 200 },
    { x: 120, y: 560 },
    { x: CENTER_X, y: 560 },
    { x: CENTER_X, y: END_Y }
  ],
  doubleL: [
    { x: 120, y: 0 },
    { x: 120, y: 180 },
    { x: 840, y: 180 },
    { x: 840, y: 420 },
    { x: 200, y: 420 },
    { x: 200, y: 560 },
    { x: CENTER_X, y: 560 },
    { x: CENTER_X, y: END_Y }
  ],
  zigzag: [
    { x: 80, y: 0 },
    { x: 240, y: 120 },
    { x: 80, y: 240 },
    { x: 240, y: 360 },
    { x: 80, y: 480 },
    { x: 240, y: 560 },
    { x: CENTER_X, y: 560 },
    { x: CENTER_X, y: END_Y }
  ],
  maze: [
    { x: CENTER_X, y: 0 },
    { x: CENTER_X, y: 60 },
    { x: 120, y: 60 },
    { x: 120, y: 200 },
    { x: 360, y: 200 },
    { x: 360, y: 100 },
    { x: 600, y: 100 },
    { x: 600, y: 260 },
    { x: 840, y: 260 },
    { x: 840, y: 420 },
    { x: 480, y: 420 },
    { x: 480, y: 520 },
    { x: 200, y: 520 },
    { x: 200, y: 580 },
    { x: CENTER_X, y: 580 },
    { x: CENTER_X, y: END_Y }
  ],
  ring: [
    { x: CENTER_X, y: 0 },
    { x: CENTER_X, y: 80 },
    { x: 800, y: 80 },
    { x: 800, y: 480 },
    { x: 160, y: 480 },
    { x: 160, y: 160 },
    { x: 640, y: 160 },
    { x: 640, y: 400 },
    { x: 320, y: 400 },
    { x: 320, y: 240 },
    { x: 480, y: 240 },
    { x: 480, y: END_Y }
  ],
  doubleRing: [
    { x: CENTER_X, y: 0 },
    { x: CENTER_X, y: 40 },
    { x: 840, y: 40 },
    { x: 840, y: 520 },
    { x: 120, y: 520 },
    { x: 120, y: 120 },
    { x: 760, y: 120 },
    { x: 760, y: 440 },
    { x: 200, y: 440 },
    { x: 200, y: 200 },
    { x: 680, y: 200 },
    { x: 680, y: 360 },
    { x: 280, y: 360 },
    { x: 280, y: 280 },
    { x: CENTER_X, y: 280 },
    { x: CENTER_X, y: END_Y }
  ],
  longLine: [
    { x: 60, y: 0 },
    { x: 60, y: 80 },
    { x: 900, y: 80 },
    { x: 900, y: 180 },
    { x: 60, y: 180 },
    { x: 60, y: 280 },
    { x: 900, y: 280 },
    { x: 900, y: 380 },
    { x: 60, y: 380 },
    { x: 60, y: 480 },
    { x: 900, y: 480 },
    { x: 900, y: 560 },
    { x: CENTER_X, y: 560 },
    { x: CENTER_X, y: END_Y }
  ],
  complexMaze: [
    { x: CENTER_X, y: 0 },
    { x: CENTER_X, y: 40 },
    { x: 80, y: 40 },
    { x: 80, y: 160 },
    { x: 320, y: 160 },
    { x: 320, y: 80 },
    { x: 560, y: 80 },
    { x: 560, y: 200 },
    { x: 880, y: 200 },
    { x: 880, y: 360 },
    { x: 640, y: 360 },
    { x: 640, y: 280 },
    { x: 400, y: 280 },
    { x: 400, y: 440 },
    { x: 160, y: 440 },
    { x: 160, y: 560 },
    { x: 720, y: 560 },
    { x: 720, y: 480 },
    { x: 560, y: 480 },
    { x: 560, y: 540 },
    { x: CENTER_X, y: 540 },
    { x: CENTER_X, y: END_Y }
  ],
  ultimateMaze: [
    { x: CENTER_X, y: 0 },
    { x: CENTER_X, y: 30 },
    { x: 60, y: 30 },
    { x: 60, y: 120 },
    { x: 240, y: 120 },
    { x: 240, y: 60 },
    { x: 480, y: 60 },
    { x: 480, y: 150 },
    { x: 720, y: 150 },
    { x: 720, y: 60 },
    { x: 900, y: 60 },
    { x: 900, y: 240 },
    { x: 600, y: 240 },
    { x: 600, y: 330 },
    { x: 300, y: 330 },
    { x: 300, y: 210 },
    { x: 120, y: 210 },
    { x: 120, y: 390 },
    { x: 420, y: 390 },
    { x: 420, y: 480 },
    { x: 780, y: 480 },
    { x: 780, y: 360 },
    { x: 840, y: 360 },
    { x: 840, y: 540 },
    { x: 540, y: 540 },
    { x: 540, y: 580 },
    { x: CENTER_X, y: 580 },
    { x: CENTER_X, y: END_Y }
  ]
};

const towerUnlocks = {
  1: ['arrow'],
  5: ['arrow', 'ice'],
  10: ['arrow', 'ice', 'magic'],
  13: ['arrow', 'ice', 'magic', 'sniper']
};

function getAvailableTowers(levelId) {
  if (levelId >= 13) return towerUnlocks[13];
  if (levelId >= 10) return towerUnlocks[10];
  if (levelId >= 5) return towerUnlocks[5];
  return towerUnlocks[1];
}

function getMap(levelId) {
  if (levelId <= 2) return maps.zShape;
  if (levelId <= 5) return maps.sShape;
  if (levelId <= 7) return maps.uShape;
  if (levelId <= 10) return maps.snake;
  if (levelId <= 12) return maps.spiral;
  if (levelId <= 14) return maps.lShape;
  if (levelId <= 16) return maps.doubleL;
  if (levelId <= 18) return maps.zigzag;
  if (levelId <= 21) return maps.maze;
  if (levelId <= 24) return maps.ring;
  if (levelId <= 26) return maps.doubleRing;
  if (levelId <= 29) return maps.longLine;
  if (levelId <= 34) return maps.complexMaze;
  if (levelId <= 44) return maps.complexMaze;
  return maps.ultimateMaze;
}

function createWave(delay, monsters) {
  return { delay, monsters };
}

function slimeWave(count, interval, delay = 0) {
  return createWave(delay, [{ type: 'slime', count, interval }]);
}

function runnerWave(count, interval, delay = 0) {
  return createWave(delay, [{ type: 'runner', count, interval }]);
}

function tankWave(count, interval, delay = 0) {
  return createWave(delay, [{ type: 'tank', count, interval }]);
}

function mixedWave(slimeCount, runnerCount, tankCount, interval, delay = 0) {
  const monsters = [];
  if (slimeCount > 0) monsters.push({ type: 'slime', count: slimeCount, interval });
  if (runnerCount > 0) monsters.push({ type: 'runner', count: runnerCount, interval });
  if (tankCount > 0) monsters.push({ type: 'tank', count: tankCount, interval });
  return createWave(delay, monsters);
}

function bossWave(bossCount, minionCount, delay = 0) {
  const monsters = [{ type: 'boss', count: bossCount, interval: 5000 }];
  if (minionCount > 0) {
    monsters.push({ type: 'slime', count: minionCount, interval: 1500 });
  }
  return createWave(delay, monsters);
}

const levels = [
  // 第一阶段：基准键入门（1-3）
  {
    id: 1, name: '左手基准键', practiceLetters: 'asdf',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(1),
    path: getMap(1),
    waves: [
      slimeWave(6, 2500, 0),
      slimeWave(8, 2200, 3000),
      slimeWave(10, 2000, 3000)
    ]
  },
  {
    id: 2, name: '右手基准键', practiceLetters: 'jkl;',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(2),
    path: getMap(2),
    waves: [
      slimeWave(7, 2400, 0),
      slimeWave(9, 2100, 3000),
      slimeWave(11, 1900, 3000)
    ]
  },
  {
    id: 3, name: '双手基准键', practiceLetters: 'asdfghjkl;',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(3),
    path: getMap(3),
    waves: [
      slimeWave(6, 2200, 0),
      mixedWave(6, 3, 0, 2000, 3000),
      mixedWave(8, 4, 0, 1800, 3000),
      slimeWave(12, 1600, 3000)
    ]
  },
  // 第二阶段：上排字母（4-7）
  {
    id: 4, name: '左手上排', practiceLetters: 'qwer',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(4),
    path: getMap(4),
    waves: [
      slimeWave(7, 2200, 0),
      mixedWave(6, 4, 0, 2000, 3000),
      mixedWave(8, 5, 0, 1800, 3000),
      runnerWave(8, 1500, 3000)
    ]
  },
  {
    id: 5, name: '右手上排', practiceLetters: 'uiop',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(5),
    path: getMap(5),
    waves: [
      slimeWave(8, 2000, 0),
      mixedWave(6, 5, 0, 1800, 3000),
      mixedWave(8, 6, 0, 1600, 3000),
      runnerWave(10, 1300, 3000)
    ]
  },
  {
    id: 6, name: '上排整合', practiceLetters: 'qwertyuiop',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(6),
    path: getMap(6),
    waves: [
      slimeWave(7, 2000, 0),
      mixedWave(8, 5, 0, 1700, 3000),
      mixedWave(10, 6, 0, 1500, 3000),
      runnerWave(12, 1200, 3000),
      slimeWave(14, 1400, 3000)
    ]
  },
  {
    id: 7, name: '基准+上排', practiceLetters: 'asdfghjkl;qwertyuiop',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(7),
    path: getMap(7),
    waves: [
      mixedWave(8, 4, 0, 1800, 0),
      mixedWave(10, 5, 0, 1600, 3000),
      mixedWave(8, 6, 2, 1500, 3000),
      runnerWave(14, 1100, 3000),
      tankWave(3, 2500, 3000)
    ]
  },
  // 第三阶段：下排字母（8-12）
  {
    id: 8, name: '左手下排', practiceLetters: 'zxcv',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(8),
    path: getMap(8),
    waves: [
      slimeWave(8, 2000, 0),
      mixedWave(8, 5, 0, 1700, 3000),
      mixedWave(10, 6, 0, 1500, 3000),
      runnerWave(12, 1200, 3000),
      slimeWave(14, 1400, 3000)
    ]
  },
  {
    id: 9, name: '右手下排', practiceLetters: 'm,./',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(9),
    path: getMap(9),
    waves: [
      slimeWave(9, 1800, 0),
      mixedWave(8, 6, 0, 1600, 3000),
      mixedWave(10, 7, 0, 1400, 3000),
      runnerWave(14, 1100, 3000),
      mixedWave(10, 5, 1, 1500, 3000)
    ]
  },
  {
    id: 10, name: '下排整合', practiceLetters: 'zxcvbnm,./',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(10),
    path: getMap(10),
    waves: [
      slimeWave(7, 1800, 0),
      mixedWave(10, 6, 0, 1500, 3000),
      mixedWave(10, 8, 1, 1400, 3000),
      runnerWave(16, 1000, 3000),
      tankWave(3, 2200, 3000),
      slimeWave(16, 1200, 3000)
    ]
  },
  {
    id: 11, name: '基准+下排', practiceLetters: 'asdfghjkl;zxcvbnm,./',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(11),
    path: getMap(11),
    waves: [
      mixedWave(10, 5, 0, 1600, 0),
      mixedWave(12, 6, 1, 1400, 3000),
      mixedWave(10, 8, 2, 1300, 3000),
      runnerWave(18, 900, 3000),
      tankWave(5, 2000, 3000),
      mixedWave(12, 6, 2, 1200, 3000)
    ]
  },
  {
    id: 12, name: '全键盘字母', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(12),
    path: getMap(12),
    waves: [
      mixedWave(10, 6, 1, 1500, 0),
      mixedWave(12, 8, 2, 1300, 3000),
      runnerWave(20, 800, 3000),
      tankWave(6, 1800, 3000),
      mixedWave(15, 8, 3, 1100, 3000),
      bossWave(1, 8, 3000)
    ]
  },
  // 第四阶段：数字行（13-17）
  {
    id: 13, name: '左手数字', practiceLetters: '12345',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(13),
    path: getMap(13),
    waves: [
      slimeWave(8, 1800, 0),
      mixedWave(10, 6, 0, 1500, 3000),
      mixedWave(12, 8, 1, 1300, 3000),
      runnerWave(16, 900, 3000),
      tankWave(4, 2000, 3000)
    ]
  },
  {
    id: 14, name: '右手数字', practiceLetters: '67890',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(14),
    path: getMap(14),
    waves: [
      slimeWave(10, 1600, 0),
      mixedWave(12, 8, 1, 1300, 3000),
      mixedWave(14, 10, 2, 1100, 3000),
      runnerWave(20, 800, 3000),
      tankWave(5, 1800, 3000),
      slimeWave(18, 1000, 3000)
    ]
  },
  {
    id: 15, name: '数字行整合', practiceLetters: '1234567890',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(15),
    path: getMap(15),
    waves: [
      mixedWave(12, 6, 1, 1400, 0),
      mixedWave(14, 10, 2, 1200, 3000),
      runnerWave(22, 700, 3000),
      tankWave(6, 1600, 3000),
      mixedWave(16, 10, 3, 1000, 3000),
      slimeWave(20, 900, 3000)
    ]
  },
  {
    id: 16, name: '字母+数字', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(16),
    path: getMap(16),
    waves: [
      mixedWave(12, 8, 2, 1300, 0),
      mixedWave(15, 10, 3, 1100, 3000),
      runnerWave(24, 700, 3000),
      tankWave(8, 1500, 3000),
      mixedWave(18, 12, 4, 900, 3000),
      bossWave(1, 12, 3000)
    ]
  },
  {
    id: 17, name: '数字强化', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(17),
    path: getMap(17),
    waves: [
      mixedWave(14, 10, 2, 1200, 0),
      runnerWave(26, 600, 3000),
      tankWave(10, 1400, 3000),
      mixedWave(20, 14, 5, 800, 3000),
      slimeWave(24, 700, 3000),
      bossWave(1, 15, 3000)
    ]
  },
  // 第五阶段：标点符号（18-24）
  {
    id: 18, name: '基础标点', practiceLetters: ',.;:',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(18),
    path: getMap(18),
    waves: [
      slimeWave(10, 1600, 0),
      mixedWave(12, 8, 1, 1300, 3000),
      mixedWave(14, 10, 2, 1100, 3000),
      runnerWave(20, 750, 3000),
      tankWave(6, 1700, 3000),
      slimeWave(18, 900, 3000)
    ]
  },
  {
    id: 19, name: '括号符号', practiceLetters: '()[]{}',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(19),
    path: getMap(19),
    waves: [
      mixedWave(12, 8, 2, 1300, 0),
      mixedWave(15, 10, 3, 1100, 3000),
      runnerWave(24, 650, 3000),
      tankWave(8, 1500, 3000),
      mixedWave(18, 12, 4, 900, 3000),
      slimeWave(22, 800, 3000)
    ]
  },
  {
    id: 20, name: '数学符号', practiceLetters: '+-*/=<>',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(20),
    path: getMap(20),
    waves: [
      mixedWave(14, 10, 2, 1200, 0),
      mixedWave(16, 12, 3, 1000, 3000),
      runnerWave(26, 600, 3000),
      tankWave(10, 1400, 3000),
      mixedWave(20, 14, 5, 800, 3000),
      bossWave(1, 10, 3000)
    ]
  },
  {
    id: 21, name: '特殊符号', practiceLetters: '!@#$%^&*',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(21),
    path: getMap(21),
    waves: [
      mixedWave(12, 10, 2, 1200, 0),
      runnerWave(28, 550, 3000),
      mixedWave(18, 14, 4, 900, 3000),
      tankWave(10, 1300, 3000),
      slimeWave(26, 700, 3000),
      mixedWave(20, 16, 5, 750, 3000)
    ]
  },
  {
    id: 22, name: '引号撇号', practiceLetters: "\"'~`\\|",
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(22),
    path: getMap(22),
    waves: [
      mixedWave(14, 10, 3, 1100, 0),
      mixedWave(18, 14, 4, 900, 3000),
      runnerWave(30, 500, 3000),
      tankWave(12, 1200, 3000),
      mixedWave(22, 16, 6, 700, 3000),
      slimeWave(28, 650, 3000)
    ]
  },
  {
    id: 23, name: '标点整合', practiceLetters: ',.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(23),
    path: getMap(23),
    waves: [
      mixedWave(16, 12, 3, 1000, 0),
      mixedWave(20, 16, 5, 800, 3000),
      runnerWave(32, 450, 3000),
      tankWave(14, 1100, 3000),
      mixedWave(24, 18, 7, 650, 3000),
      bossWave(1, 15, 3000),
      slimeWave(30, 600, 3000)
    ]
  },
  {
    id: 24, name: '全字符混合', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(24),
    path: getMap(24),
    waves: [
      mixedWave(18, 12, 4, 950, 0),
      mixedWave(22, 16, 6, 750, 3000),
      runnerWave(34, 400, 3000),
      tankWave(16, 1000, 3000),
      mixedWave(28, 20, 8, 600, 3000),
      bossWave(2, 12, 3000),
      slimeWave(32, 550, 3000)
    ]
  },
  // 第六阶段：速度训练（25-34）
  {
    id: 25, name: '速度训练I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(25),
    path: getMap(25),
    waves: [
      runnerWave(20, 700, 0),
      runnerWave(28, 550, 2500),
      mixedWave(12, 20, 2, 600, 2500),
      runnerWave(36, 400, 2500),
      mixedWave(16, 24, 3, 500, 2500),
      runnerWave(40, 350, 2500)
    ]
  },
  {
    id: 26, name: '密集挑战I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(26),
    path: getMap(26),
    waves: [
      slimeWave(25, 700, 0),
      slimeWave(32, 550, 2500),
      mixedWave(28, 10, 2, 500, 2500),
      slimeWave(40, 400, 2500),
      mixedWave(32, 14, 4, 450, 2500),
      slimeWave(48, 350, 2500),
      mixedWave(36, 16, 6, 400, 2500)
    ]
  },
  {
    id: 27, name: '重甲挑战I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(27),
    path: getMap(27),
    waves: [
      tankWave(6, 1400, 0),
      mixedWave(10, 6, 8, 800, 3000),
      tankWave(10, 1100, 3000),
      mixedWave(14, 10, 12, 700, 3000),
      tankWave(14, 900, 3000),
      mixedWave(18, 12, 16, 600, 3000),
      bossWave(1, 10, 3000)
    ]
  },
  {
    id: 28, name: '混合战I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(28),
    path: getMap(28),
    waves: [
      mixedWave(15, 10, 3, 900, 0),
      mixedWave(20, 14, 5, 700, 2500),
      runnerWave(30, 450, 2500),
      mixedWave(25, 18, 8, 550, 2500),
      tankWave(12, 1000, 2500),
      mixedWave(30, 22, 10, 500, 2500),
      bossWave(1, 15, 2500)
    ]
  },
  {
    id: 29, name: 'Boss战I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(29),
    path: getMap(29),
    waves: [
      mixedWave(18, 12, 4, 800, 0),
      runnerWave(24, 500, 2500),
      tankWave(8, 1200, 2500),
      bossWave(1, 12, 2500),
      mixedWave(20, 16, 6, 600, 2500),
      bossWave(2, 10, 2500),
      slimeWave(30, 400, 2500)
    ]
  },
  {
    id: 30, name: '速度训练II', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(30),
    path: getMap(30),
    waves: [
      runnerWave(25, 600, 0),
      runnerWave(34, 480, 2000),
      mixedWave(15, 26, 3, 500, 2000),
      runnerWave(42, 350, 2000),
      mixedWave(20, 30, 5, 400, 2000),
      runnerWave(48, 300, 2000),
      mixedWave(25, 35, 6, 350, 2000)
    ]
  },
  {
    id: 31, name: '密集挑战II', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(31),
    path: getMap(31),
    waves: [
      slimeWave(30, 600, 0),
      slimeWave(40, 450, 2000),
      mixedWave(35, 14, 4, 400, 2000),
      slimeWave(50, 320, 2000),
      mixedWave(42, 20, 6, 350, 2000),
      slimeWave(60, 280, 2000),
      mixedWave(48, 24, 8, 300, 2000)
    ]
  },
  {
    id: 32, name: '重甲挑战II', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(32),
    path: getMap(32),
    waves: [
      tankWave(8, 1200, 0),
      mixedWave(14, 8, 10, 700, 2500),
      tankWave(14, 950, 2500),
      mixedWave(20, 14, 16, 600, 2500),
      tankWave(20, 800, 2500),
      mixedWave(26, 18, 20, 500, 2500),
      bossWave(2, 12, 2500)
    ]
  },
  {
    id: 33, name: '混合战II', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(33),
    path: getMap(33),
    waves: [
      mixedWave(20, 14, 5, 750, 0),
      mixedWave(28, 20, 8, 550, 2000),
      runnerWave(38, 380, 2000),
      mixedWave(35, 26, 12, 450, 2000),
      tankWave(16, 850, 2000),
      mixedWave(42, 32, 16, 380, 2000),
      bossWave(2, 18, 2000)
    ]
  },
  {
    id: 34, name: '阶段测试', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(34),
    path: getMap(34),
    waves: [
      mixedWave(22, 16, 6, 700, 0),
      runnerWave(36, 350, 2000),
      tankWave(14, 900, 2000),
      mixedWave(38, 28, 14, 400, 2000),
      slimeWave(50, 300, 2000),
      bossWave(2, 20, 2000),
      mixedWave(45, 35, 18, 320, 2000)
    ]
  },
  // 第七阶段：精通挑战（35-44）
  {
    id: 35, name: '闪电战I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(35),
    path: getMap(35),
    waves: [
      runnerWave(30, 500, 0),
      runnerWave(42, 380, 1800),
      mixedWave(20, 36, 5, 400, 1800),
      runnerWave(55, 280, 1800),
      mixedWave(28, 44, 8, 320, 1800),
      runnerWave(65, 240, 1800),
      mixedWave(35, 50, 10, 280, 1800)
    ]
  },
  {
    id: 36, name: '人海战术I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(36),
    path: getMap(36),
    waves: [
      slimeWave(40, 500, 0),
      slimeWave(55, 360, 1800),
      mixedWave(48, 20, 6, 320, 1800),
      slimeWave(70, 250, 1800),
      mixedWave(60, 28, 10, 280, 1800),
      slimeWave(85, 210, 1800),
      mixedWave(70, 35, 14, 240, 1800)
    ]
  },
  {
    id: 37, name: '钢铁军团I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(37),
    path: getMap(37),
    waves: [
      tankWave(10, 1000, 0),
      mixedWave(18, 12, 14, 600, 2000),
      tankWave(18, 800, 2000),
      mixedWave(28, 20, 22, 480, 2000),
      tankWave(26, 650, 2000),
      mixedWave(38, 28, 30, 400, 2000),
      bossWave(3, 15, 2000)
    ]
  },
  {
    id: 38, name: '混乱战场I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(38),
    path: getMap(38),
    waves: [
      mixedWave(28, 20, 8, 600, 0),
      runnerWave(48, 300, 1800),
      tankWave(18, 750, 1800),
      mixedWave(45, 35, 18, 350, 1800),
      slimeWave(65, 220, 1800),
      bossWave(2, 25, 1800),
      mixedWave(55, 45, 25, 280, 1800)
    ]
  },
  {
    id: 39, name: '双Boss', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(39),
    path: getMap(39),
    waves: [
      mixedWave(30, 22, 10, 550, 0),
      runnerWave(50, 280, 1800),
      tankWave(20, 700, 1800),
      bossWave(2, 20, 1800),
      mixedWave(50, 38, 20, 320, 1800),
      bossWave(3, 15, 1800),
      slimeWave(70, 200, 1800)
    ]
  },
  {
    id: 40, name: '生存挑战', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(40),
    path: getMap(40),
    waves: [
      mixedWave(25, 18, 6, 650, 0),
      runnerWave(40, 350, 1500),
      mixedWave(35, 25, 12, 450, 1500),
      tankWave(15, 800, 1500),
      slimeWave(55, 280, 1500),
      mixedWave(48, 36, 20, 350, 1500),
      bossWave(2, 20, 1500),
      runnerWave(60, 220, 1500),
      mixedWave(60, 48, 28, 250, 1500),
      tankWave(25, 600, 1500),
      slimeWave(80, 180, 1500),
      bossWave(3, 25, 1500)
    ]
  },
  {
    id: 41, name: '闪电战II', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(41),
    path: getMap(41),
    waves: [
      runnerWave(38, 400, 0),
      runnerWave(52, 300, 1500),
      mixedWave(25, 45, 7, 320, 1500),
      runnerWave(68, 220, 1500),
      mixedWave(35, 55, 10, 250, 1500),
      runnerWave(80, 180, 1500),
      mixedWave(45, 65, 14, 210, 1500),
      runnerWave(90, 150, 1500)
    ]
  },
  {
    id: 42, name: '人海战术II', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(42),
    path: getMap(42),
    waves: [
      slimeWave(50, 400, 0),
      slimeWave(70, 280, 1500),
      mixedWave(62, 26, 8, 250, 1500),
      slimeWave(90, 200, 1500),
      mixedWave(78, 36, 14, 210, 1500),
      slimeWave(110, 160, 1500),
      mixedWave(92, 48, 20, 180, 1500)
    ]
  },
  {
    id: 43, name: '钢铁军团II', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(43),
    path: getMap(43),
    waves: [
      tankWave(14, 850, 0),
      mixedWave(24, 18, 20, 500, 1800),
      tankWave(24, 680, 1800),
      mixedWave(38, 28, 30, 400, 1800),
      tankWave(36, 550, 1800),
      mixedWave(52, 40, 42, 320, 1800),
      bossWave(4, 18, 1800)
    ]
  },
  {
    id: 44, name: '大师挑战', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(44),
    path: getMap(44),
    waves: [
      mixedWave(35, 25, 12, 500, 0),
      runnerWave(60, 250, 1500),
      tankWave(24, 650, 1500),
      mixedWave(55, 42, 24, 300, 1500),
      slimeWave(80, 180, 1500),
      bossWave(3, 30, 1500),
      mixedWave(70, 55, 35, 220, 1500),
      bossWave(4, 20, 1500)
    ]
  },
  // 第八阶段：盲打大师（45-52）
  {
    id: 45, name: '大师试炼I', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(45),
    path: getMap(45),
    waves: [
      mixedWave(40, 28, 15, 450, 0),
      runnerWave(65, 230, 1500),
      tankWave(28, 600, 1500),
      mixedWave(65, 50, 30, 270, 1500),
      slimeWave(90, 160, 1500),
      bossWave(3, 35, 1500),
      mixedWave(80, 62, 42, 200, 1500),
      tankWave(40, 480, 1500)
    ]
  },
  {
    id: 46, name: '大师试炼II', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(46),
    path: getMap(46),
    waves: [
      runnerWave(70, 200, 0),
      mixedWave(60, 55, 35, 230, 1500),
      tankWave(32, 550, 1500),
      slimeWave(100, 140, 1500),
      mixedWave(85, 68, 48, 180, 1500),
      bossWave(4, 25, 1500),
      runnerWave(100, 140, 1500),
      mixedWave(95, 78, 58, 150, 1500)
    ]
  },
  {
    id: 47, name: 'Boss冲锋', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(47),
    path: getMap(47),
    waves: [
      mixedWave(45, 32, 18, 420, 0),
      bossWave(2, 20, 1500),
      mixedWave(55, 42, 28, 320, 1500),
      bossWave(3, 25, 1500),
      mixedWave(70, 55, 40, 230, 1500),
      bossWave(4, 30, 1500),
      mixedWave(85, 68, 52, 180, 1500),
      bossWave(5, 35, 1500)
    ]
  },
  {
    id: 48, name: '无尽狂潮', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(48),
    path: getMap(48),
    waves: [
      slimeWave(60, 350, 0),
      mixedWave(70, 30, 15, 280, 1200),
      runnerWave(80, 180, 1200),
      slimeWave(110, 130, 1200),
      mixedWave(90, 60, 30, 170, 1200),
      tankWave(40, 420, 1200),
      mixedWave(100, 75, 45, 140, 1200),
      runnerWave(110, 120, 1200),
      slimeWave(130, 100, 1200),
      mixedWave(120, 90, 60, 110, 1200)
    ]
  },
  {
    id: 49, name: '钢铁洪流', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(49),
    path: getMap(49),
    waves: [
      tankWave(18, 750, 0),
      mixedWave(35, 25, 25, 400, 1500),
      tankWave(30, 550, 1500),
      mixedWave(50, 38, 40, 300, 1500),
      tankWave(45, 420, 1500),
      mixedWave(70, 55, 60, 220, 1500),
      tankWave(60, 350, 1500),
      bossWave(5, 30, 1500),
      mixedWave(90, 72, 80, 160, 1500)
    ]
  },
  {
    id: 50, name: '混乱风暴', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(50),
    path: getMap(50),
    waves: [
      mixedWave(50, 35, 20, 380, 0),
      runnerWave(80, 170, 1200),
      tankWave(35, 500, 1200),
      slimeWave(100, 120, 1200),
      mixedWave(80, 60, 45, 180, 1200),
      bossWave(4, 35, 1200),
      runnerWave(120, 100, 1200),
      mixedWave(110, 85, 70, 130, 1200),
      tankWave(55, 350, 1200),
      slimeWave(140, 90, 1200)
    ]
  },
  {
    id: 51, name: '盲打宗师', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(51),
    path: getMap(51),
    waves: [
      mixedWave(55, 40, 25, 350, 0),
      runnerWave(90, 150, 1000),
      tankWave(40, 450, 1000),
      slimeWave(120, 100, 1000),
      mixedWave(100, 75, 60, 150, 1000),
      bossWave(5, 40, 1000),
      mixedWave(130, 100, 85, 110, 1000),
      runnerWave(150, 80, 1000),
      tankWave(70, 300, 1000),
      bossWave(6, 50, 1000),
      mixedWave(150, 120, 100, 90, 1000)
    ]
  },
  {
    id: 52, name: '盲打大师', practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    startGold: 0, startLives: 10, typingDifficulty: 1,
    availableTowers: getAvailableTowers(52),
    path: getMap(52),
    waves: [
      mixedWave(60, 45, 30, 320, 0),
      runnerWave(100, 130, 1000),
      tankWave(50, 400, 1000),
      slimeWave(140, 85, 1000),
      mixedWave(120, 90, 75, 130, 1000),
      bossWave(5, 50, 1000),
      mixedWave(150, 120, 100, 100, 1000),
      runnerWave(180, 70, 1000),
      tankWave(90, 250, 1000),
      bossWave(8, 60, 1000),
      mixedWave(180, 150, 130, 75, 1000),
      slimeWave(200, 60, 1000),
      bossWave(10, 80, 1000),
      mixedWave(200, 170, 150, 55, 1000),
      bossWave(15, 100, 1000)
    ]
  },
  // 无尽模式
  {
    id: 53, name: '无尽模式',
    practiceLetters: 'qwertyuiopasdfghjkl;zxcvbnm,./1234567890,.;:()[]{}+-*/=<>!@#$%^&*"\'~`\\|',
    isEndless: true,
    startGold: 300, startLives: 10, typingDifficulty: 1,
    availableTowers: ['arrow', 'ice', 'magic', 'sniper'],
    path: maps.complexMaze,
    waves: [
      mixedWave(15, 10, 3, 1200, 0),
      mixedWave(20, 14, 5, 950, 2000),
      runnerWave(30, 500, 2000),
      mixedWave(25, 18, 8, 700, 2000),
      tankWave(10, 1000, 2000),
      slimeWave(40, 400, 2000),
      mixedWave(35, 25, 12, 550, 2000),
      bossWave(2, 15, 2000),
      mixedWave(45, 35, 18, 400, 2000),
      runnerWave(60, 300, 2000)
    ]
  }
];

const outputPath = path.join(__dirname, '..', 'src', 'data', 'levels.json');
fs.writeFileSync(outputPath, JSON.stringify(levels, null, 2), 'utf8');
console.log(`Generated ${levels.length} levels`);
