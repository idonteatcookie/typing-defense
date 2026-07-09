import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { gameManager } from '@/game/GameManager';
import { eventBus } from '@/game/EventBus';
import { EVENT_NAMES } from '@/constants/eventNames';

export default function BottomInput() {
  const currentTarget = useGameStore((state) => state.currentTypingTarget);
  const combo = useGameStore((state) => state.combo);
  const gameScreen = useGameStore((state) => state.gameScreen);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 1 });

  const getComboLevel = (c: number) => {
    if (c >= 50) return 4;
    if (c >= 20) return 3;
    if (c >= 10) return 2;
    if (c >= 5) return 1;
    return 0;
  };

  const comboLevel = getComboLevel(combo);
  const isFrenzy = comboLevel >= 2;

  const getComboProgress = () => {
    if (combo >= 50) return 100;
    if (combo >= 20) return 100;
    if (combo >= 10) return ((combo - 10) / 10) * 100;
    return 0;
  };

  const getProgressColor = () => {
    if (combo >= 50) return '#ef4444';
    if (combo >= 20) return '#a855f7';
    if (combo >= 10) return '#f97316';
    return '#fde047';
  };

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
    const handleCorrect = () => {
      setIsCorrect(true);
      setTimeout(() => setIsCorrect(false), 150);
    };

    const handleWrong = () => {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 300);
    };

    eventBus.on(EVENT_NAMES.TYPING_CORRECT, handleCorrect);
    eventBus.on(EVENT_NAMES.TYPING_WRONG, handleWrong);

    return () => {
      eventBus.off(EVENT_NAMES.TYPING_CORRECT, handleCorrect);
      eventBus.off(EVENT_NAMES.TYPING_WRONG, handleWrong);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameScreen !== 'playing') return;
      if (e.key.length !== 1) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      gameManager.handleTypingInput(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameScreen]);

  const rawDisplay = currentTarget
    ? gameManager.typingManager.getDisplayText()
    : null;

  // 输入正确时，字母已移到 before 中，将其移回 current 位置显示，避免向左移动
  const displayText = isCorrect && rawDisplay && rawDisplay.current === ''
    ? {
        before: rawDisplay.before.slice(0, -1),
        current: rawDisplay.before.slice(-1),
        after: rawDisplay.after,
      }
    : rawDisplay;

  return (
    <div className="w-full h-24">
      <div className="h-full flex items-center justify-between px-6">
        <div className="w-28" />

        <div className="flex items-center justify-center">
          <div
            className={`text-3xl font-bold ${wrongShake ? 'shake-wrong' : ''}`}
            style={{ fontFamily: 'Zpix, monospace' }}
          >
            {displayText ? (
              <>
                <span className="text-slate-400">输入字母:</span>
                <span className="char-before text-green-400 ml-2">{displayText.before}</span>
                <span
                  className="char-current text-yellow-300 ml-2"
                  style={{
                    color: isCorrect ? '#4ade80' : wrongShake ? '#ef4444' : '#fde047',
                  }}
                >
                  {displayText.current}
                </span>
                <span className="char-after text-gray-400 ml-1">{displayText.after}</span>
              </>
            ) : (
              <span className="text-slate-500">输入字母: 等待怪物...</span>
            )}
          </div>
        </div>

        <div className="flex gap-3 text-right shrink-0">
          <div className="w-28 px-2 py-1 rounded bg-[#92400e]/30">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-[#92400e] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${getComboProgress()}%`,
                    backgroundColor: getProgressColor(),
                  }}
                />
              </div>
              <span
                className="text-sm font-bold shrink-0"
                style={{ fontFamily: 'Zpix, monospace', color: getProgressColor() }}
              >
                {combo}
              </span>
            </div>
            <div
              className="text-slate-400 text-xs mt-1"
              style={{ fontFamily: 'Zpix, monospace' }}
            >
              狂热
            </div>
          </div>
          <div className="w-18">
            <div
              className="text-slate-400 text-sm"
              style={{ fontFamily: 'Zpix, monospace' }}
            >
              速度
            </div>
            <div
              className="text-2xl text-green-400 font-bold text-right"
              style={{ fontFamily: 'Zpix, monospace' }}
            >
              {stats.wpm} WPM
            </div>
          </div>
          <div className="w-18">
            <div
              className="text-slate-400 text-sm"
              style={{ fontFamily: 'Zpix, monospace' }}
            >
              准确率
            </div>
            <div
              className="text-2xl text-blue-400 font-bold text-right"
              style={{ fontFamily: 'Zpix, monospace' }}
            >
              {Math.round(stats.accuracy * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
