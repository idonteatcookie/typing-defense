import { useRef, useEffect, Children, isValidElement, useState } from 'react';
import { createPhaserGame } from '@/phaser/PhaserGame';
import TopBar from '../layout/TopBar';
import LeftPanel from '../layout/LeftPanel';
import BottomInput from '../layout/BottomInput';
import ComboDisplay from '../game/ComboDisplay';
import { useGameStore } from '@/store/useGameStore';
import { eventBus } from '@/game/EventBus';
import { EVENT_NAMES } from '@/constants/eventNames';

interface GameViewProps {
  onPause: () => void;
  children?: React.ReactNode;
}

export default function GameView({ onPause, children }: GameViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [comboLevel, setComboLevel] = useState(0);
  const [isDanger, setIsDanger] = useState(false);
  const placingTowerType = useGameStore((state) => state.placingTowerType);
  const cancelPlacingTower = useGameStore((state) => state.cancelPlacingTower);

  useEffect(() => {
    if (!containerRef.current) return;

    gameRef.current = createPhaserGame(containerRef.current);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const getComboLevel = (combo: number) => {
      if (combo >= 50) return 4;
      if (combo >= 20) return 3;
      if (combo >= 10) return 2;
      if (combo >= 5) return 1;
      return 0;
    };

    const handleCorrect = (data: { combo: number }) => {
      setComboLevel(getComboLevel(data.combo));
    };

    const handleWrong = () => {
      setComboLevel(0);
    };

    const handleVictory = () => {
      setComboLevel(0);
    };

    const handleDefeat = () => {
      setComboLevel(0);
    };

    eventBus.on(EVENT_NAMES.TYPING_CORRECT, handleCorrect);
    eventBus.on(EVENT_NAMES.TYPING_WRONG, handleWrong);
    eventBus.on(EVENT_NAMES.GAME_VICTORY, handleVictory);
    eventBus.on(EVENT_NAMES.GAME_DEFEAT, handleDefeat);

    const handleNearEnd = (nearEnd: boolean) => {
      setIsDanger(nearEnd);
    };
    eventBus.on(EVENT_NAMES.MONSTER_NEAR_END, handleNearEnd);

    const handleGameStart = () => {
      setIsDanger(false);
    };
    eventBus.on(EVENT_NAMES.GAME_START, handleGameStart);

    return () => {
      eventBus.off(EVENT_NAMES.TYPING_CORRECT, handleCorrect);
      eventBus.off(EVENT_NAMES.TYPING_WRONG, handleWrong);
      eventBus.off(EVENT_NAMES.GAME_VICTORY, handleVictory);
      eventBus.off(EVENT_NAMES.GAME_DEFEAT, handleDefeat);
      eventBus.off(EVENT_NAMES.MONSTER_NEAR_END, handleNearEnd);
      eventBus.off(EVENT_NAMES.GAME_START, handleGameStart);
    };
  }, []);

  const hasDialog = Children.toArray(children).some(
    (child) => isValidElement(child)
  );

  const getGlowClass = () => {
    if (comboLevel === 0) return '';
    return `combo-glow combo-glow-level-${comboLevel}`;
  };

  const isFrenzy = comboLevel >= 2;

  return (
    <div className="game-container flex flex-col">
      <TopBar onPause={onPause} />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />

        <div
          className="relative"
          style={{ width: '960px', height: '640px' }}
        >
          <div ref={containerRef} className="w-full h-full" />

          {placingTowerType && (
            <div className="placing-hint-bar">
              <span className="text-green-300 pixel-text">
                📍 点击地图放置防御塔
              </span>
              <button
                className="placing-cancel-btn"
                onClick={cancelPlacingTower}
              >
                取消 (ESC)
              </button>
            </div>
          )}

          <div className={getGlowClass()} />
          {isDanger && <div className="danger-glow" />}
          {isFrenzy && (
            <div className="frenzy-fire">
              <div className="fire-glow" />
              <div className="flame-base" />
              <div className="flame-tongue-1" />
              <div className="flame-tongue-2" />
              <div className="flame-tongue-3" />
              <div className="flame-tongue-4" />
              <div className="flame-tongue-5" />
              <div className="flame-mid" />
              <div className="flame-inner" />
              <div className="flame-tip" />
              <div className="sparks">
                <div className="spark" />
                <div className="spark" />
                <div className="spark" />
                <div className="spark" />
                <div className="spark" />
                <div className="spark" />
                <div className="spark" />
                <div className="spark" />
              </div>
            </div>
          )}
          <ComboDisplay />

          {hasDialog && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
              {children}
            </div>
          )}
        </div>
      </div>

      <BottomInput />
    </div>
  );
}

