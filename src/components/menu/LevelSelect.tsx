import { useUserStore } from '@/store/useUserStore';
import { gameManager } from '@/game/GameManager';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export default function LevelSelect({ onSelectLevel, onBack }: LevelSelectProps) {
  const levels = gameManager.levelManager.getLevels();
  const levelProgress = useUserStore((state) => state.levelProgress);
  const isLoaded = useUserStore((state) => state.isLoaded);

  const getStars = (levelId: number): number => {
    return levelProgress[levelId]?.stars || 0;
  };

  const isUnlocked = (levelId: number): boolean => {
    if (levelId === 1) return true;
    return levelProgress[levelId]?.unlocked || false;
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`text-2xl ${i <= count ? 'text-yellow-400' : 'text-slate-600'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatPracticeLetters = (letters: string | undefined): string => {
    if (!letters) return '';
    if (letters.length <= 6) return letters.toUpperCase();
    return letters.slice(0, 6).toUpperCase() + '...';
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-6 p-8 relative overflow-hidden">
      <h2 className="text-4xl font-bold text-green-400 glow-text pixel-text flex-shrink-0">
        选择关卡
      </h2>

      <div className="w-full flex-1 overflow-y-auto">
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-4 gap-4 pb-24">
            {levels.filter(level => !level.isEndless).map((level) => {
              const unlocked = isUnlocked(level.id);
              const stars = getStars(level.id);

              return (
                <button
                  key={level.id}
                  className={`panel p-4 w-40 transition-all duration-200 flex-shrink-0 ${
                    unlocked
                      ? 'hover:scale-105 hover:border-green-400 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => unlocked && onSelectLevel(level.id)}
                  disabled={!unlocked}
                >
                  <div className="text-4xl font-bold text-center mb-1 text-slate-200">
                    {unlocked ? level.id : '🔒'}
                  </div>
                  <div className="text-lg text-center text-slate-300 mb-1">
                    {level.name}
                  </div>
                  {level.practiceLetters && (
                    <div className="text-sm text-center text-yellow-400 mb-2 font-mono">
                      {formatPracticeLetters(level.practiceLetters)}
                    </div>
                  )}
                  {unlocked && renderStars(stars)}
                  {!unlocked && (
                    <div className="text-xs text-slate-500 text-center mt-1">
                      完成上一关解锁
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        className="btn-game text-lg bg-slate-600 text-white absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ boxShadow: '0 4px 0 #334155, 0 6px 10px rgba(0,0,0,0.3)' }}
        onClick={onBack}
      >
        返回主菜单
      </button>
    </div>
  );
}
