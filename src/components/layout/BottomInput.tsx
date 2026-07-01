import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { gameManager } from '@/game/GameManager';

export default function BottomInput() {
  const currentTarget = useGameStore((state) => state.currentTypingTarget);
  const combo = useGameStore((state) => state.combo);
  const gameScreen = useGameStore((state) => state.gameScreen);
  const [inputShake, setInputShake] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 1 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameScreen === 'playing') {
        const s = gameManager.getTypingStats();
        setStats({ wpm: s.wpm, accuracy: s.accuracy });
      }
    }, 200);

    return () => clearInterval(interval);
  }, [gameScreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameScreen !== 'playing') return;
      if (e.key.length !== 1) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const beforeCombo = gameManager.typingManager.getCombo();
      gameManager.handleTypingInput(e.key);
      const afterCombo = gameManager.typingManager.getCombo();

      if (afterCombo < beforeCombo) {
        setInputShake(true);
        setTimeout(() => setInputShake(false), 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameScreen]);

  const displayText = currentTarget
    ? gameManager.typingManager.getDisplayText()
    : null;

  return (
    <div className="w-full h-24 panel rounded-b-lg rounded-t-none border-b-0 border-x-0 border-t border-slate-600">
      <div className="h-full flex items-center justify-center gap-8 px-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-slate-400 text-sm mb-1 pixel-text">目标字母</div>
          <div
            className={`input-display ${inputShake ? 'shake' : ''}`}
          >
            {displayText ? (
              <>
                <span className="char-before">{displayText.before}</span>
                <span className="char-current">{displayText.current}</span>
                <span className="char-after">{displayText.after}</span>
              </>
            ) : (
              <span className="text-slate-500">等待怪物...</span>
            )}
          </div>
        </div>

        <div className="flex gap-6 text-right">
          <div>
            <div className="text-slate-400 text-sm pixel-text">速度</div>
            <div className="text-2xl text-green-400 font-bold pixel-text">
              {stats.wpm} WPM
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-sm pixel-text">准确率</div>
            <div className="text-2xl text-blue-400 font-bold pixel-text">
              {Math.round(stats.accuracy * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
