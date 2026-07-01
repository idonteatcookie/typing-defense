import { useRef, useEffect, Children, isValidElement } from 'react';
import { createPhaserGame } from '@/phaser/PhaserGame';
import TopBar from '../layout/TopBar';
import LeftPanel from '../layout/LeftPanel';
import BottomInput from '../layout/BottomInput';
import ComboDisplay from '../game/ComboDisplay';

interface GameViewProps {
  onPause: () => void;
  children?: React.ReactNode;
}

export default function GameView({ onPause, children }: GameViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gameRef.current = createPhaserGame(containerRef.current);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const hasDialog = Children.toArray(children).some(
    (child) => isValidElement(child)
  );

  return (
    <div className="game-container flex flex-col">
      <TopBar onPause={onPause} />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />

        <div className="relative" style={{ width: '960px', height: '640px' }}>
          <div ref={containerRef} className="w-full h-full" />
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
