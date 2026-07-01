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

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-4xl">
      <h2 className="text-4xl font-bold text-green-400 glow-text pixel-text">
        选择关卡
      </h2>

      <div className="grid grid-cols-3 gap-6 mt-4">
        {levels.map((level) => {
          const unlocked = isUnlocked(level.id);
          const stars = getStars(level.id);

          return (
            <button
              key={level.id}
              className={`panel p-6 w-48 transition-all duration-200 ${
                unlocked
                  ? 'hover:scale-105 hover:border-green-400 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => unlocked && onSelectLevel(level.id)}
              disabled={!unlocked}
            >
              <div className="text-5xl font-bold text-center mb-2 text-slate-200">
                {unlocked ? level.id : '🔒'}
              </div>
              <div className="text-xl text-center text-slate-300 mb-3">
                {level.name}
              </div>
              {unlocked && renderStars(stars)}
              {!unlocked && (
                <div className="text-sm text-slate-500 text-center mt-2">
                  完成上一关解锁
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        className="btn-game text-lg bg-slate-600 text-white mt-4"
        style={{ boxShadow: '0 4px 0 #334155, 0 6px 10px rgba(0,0,0,0.3)' }}
        onClick={onBack}
      >
        返回主菜单
      </button>
    </div>
  );
}
