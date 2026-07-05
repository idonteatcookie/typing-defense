import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { gameManager } from '@/game/GameManager';
import { getTowerConfig } from '@/game/config/TowerConfig';

const TUTORIAL_KEY = 'typing_defense_tutorial';

type TutorialState = {
  typingStep: boolean;
  towerStep: boolean;
};

function loadTutorialState(): TutorialState {
  try {
    const raw = localStorage.getItem(TUTORIAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        typingStep: !!parsed.typingStep,
        towerStep: !!parsed.towerStep,
      };
    }
  } catch {
    // ignore
  }
  return { typingStep: false, towerStep: false };
}

function saveTutorialState(state: TutorialState): void {
  try {
    localStorage.setItem(TUTORIAL_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// 获取最便宜的防御塔成本
function getCheapestTowerCost(): number {
  const towers = gameManager.getAvailableTowers();
  let min = Infinity;
  for (const t of towers) {
    const config = getTowerConfig(t);
    if (config && config.cost < min) min = config.cost;
  }
  return min === Infinity ? 50 : min;
}

export default function TutorialGuide() {
  const gameScreen = useGameStore((state) => state.gameScreen);
  const gold = useGameStore((state) => state.gold);
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const [state, setState] = useState<TutorialState>(loadTutorialState);
  const [showTyping, setShowTyping] = useState(false);
  const [showTower, setShowTower] = useState(false);

  // 步骤1：游戏开始时显示打字提示（仅第1关且未看过）
  useEffect(() => {
    if (gameScreen === 'playing' && currentLevelId === 1 && !state.typingStep) {
      const timer = setTimeout(() => setShowTyping(true), 800);
      return () => clearTimeout(timer);
    }
    setShowTyping(false);
  }, [gameScreen, currentLevelId, state.typingStep]);

  // 步骤2：金币首次满足条件时显示防御塔提示（仅第1关且未看过）
  useEffect(() => {
    if (
      gameScreen === 'playing' &&
      currentLevelId === 1 &&
      !state.towerStep &&
      !showTyping // 等打字提示关闭后再显示
    ) {
      const cost = getCheapestTowerCost();
      if (gold >= cost) {
        setShowTower(true);
      }
    }
  }, [gameScreen, currentLevelId, gold, state.towerStep, showTyping]);

  const dismissTyping = () => {
    setShowTyping(false);
    const next = { ...state, typingStep: true };
    setState(next);
    saveTutorialState(next);
  };

  const dismissTower = () => {
    setShowTower(false);
    const next = { ...state, towerStep: true };
    setState(next);
    saveTutorialState(next);
  };

  if (gameScreen !== 'playing') return null;

  return (
    <>
      {/* 步骤1：打字提示 - 指向底部输入框 */}
      {showTyping && (
        <div className="tutorial-overlay" onClick={dismissTyping}>
          <div
            className="tutorial-bubble tutorial-bubble-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tutorial-arrow-down" />
            <div className="tutorial-content">
              <div className="tutorial-title">⌨️ 输入字母攻击怪物</div>
              <div className="tutorial-text">
                看下方显示的字母，在键盘上按下对应的键，
                炮塔就会发射子弹攻击怪物！
              </div>
              <button className="tutorial-btn" onClick={dismissTyping}>
                知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 步骤2：防御塔提示 - 指向左侧防御塔面板 */}
      {showTower && (
        <div className="tutorial-overlay" onClick={dismissTower}>
          <div
            className="tutorial-bubble tutorial-bubble-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tutorial-arrow-left" />
            <div className="tutorial-content">
              <div className="tutorial-title">🏰 建造防御塔</div>
              <div className="tutorial-text">
                金币足够了！点击左侧的防御塔卡片，
                然后点击地图上的空地来放置防御塔，帮你一起攻击怪物。
              </div>
              <button className="tutorial-btn" onClick={dismissTower}>
                知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
