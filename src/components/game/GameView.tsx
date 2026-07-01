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
  const [screenShake, setScreenShake] = useState<string | null>(null);

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
      const level = getComboLevel(data.combo);
      setComboLevel(level);

      if (level >= 3) {
        setScreenShake(level === 4 ? 'screen-shake-medium' : 'screen-shake-small');
        setTimeout(() => setScreenShake(null), 150);
      }
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

    return () => {
      eventBus.off(EVENT_NAMES.TYPING_CORRECT, handleCorrect);
      eventBus.off(EVENT_NAMES.TYPING_WRONG, handleWrong);
      eventBus.off(EVENT_NAMES.GAME_VICTORY, handleVictory);
      eventBus.off(EVENT_NAMES.GAME_DEFEAT, handleDefeat);
    };
  }, []);

  const hasDialog = Children.toArray(children).some(
    (child) => isValidElement(child)
  );

  const getGlowClass = () => {
    if (comboLevel === 0) return '';
    return `combo-glow combo-glow-level-${comboLevel}`;
  };

  return (
    <div className="game-container flex flex-col">
      <TopBar onPause={onPause} />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />

        <div
          className={`relative ${screenShake || ''}`}
          style={{ width: '960px', height: '640px' }}
        >
          <div ref={containerRef} className="w-full h-full" />
          <div className={getGlowClass()} />
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

