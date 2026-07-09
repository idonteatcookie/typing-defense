import { useUserStore } from '@/store/useUserStore';
import { gameManager } from '@/game/GameManager';
import { audioManager } from '@/game/AudioManager';
import { assetUrl } from '@/utils/asset';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export default function LevelSelect({ onSelectLevel, onBack }: LevelSelectProps) {
  const levels = gameManager.levelManager.getLevels();
  const levelProgress = useUserStore((state) => state.levelProgress);
  const isLoaded = useUserStore((state) => state.isLoaded);

  const handleClick = (callback: () => void) => {
    audioManager.playButtonSound();
    callback();
  };

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
    <div 
      className="w-full h-full flex flex-col items-center gap-6 p-8 relative overflow-hidden"
      style={{
        backgroundImage: assetUrl('assets/ui/menu_bg.png'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 
        className="text-4xl font-bold text-amber-700 pixel-text flex-shrink-0"
        style={{ fontFamily: 'Zpix, monospace' }}
      >
        选择关卡
      </h2>

      <div className="w-full flex-1 overflow-y-auto no-scrollbar">
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-4 gap-4 pb-24">
            {levels.filter(level => !level.isEndless).map((level) => {
              const unlocked = isUnlocked(level.id);
              const stars = getStars(level.id);

              return (
                <button
                  key={level.id}
                  className={`p-4 w-40 transition-all duration-200 flex-shrink-0 ${
                    unlocked
                      ? 'hover:scale-105 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{ 
                    fontFamily: 'Zpix, monospace',
                    backgroundImage: assetUrl('assets/ui/level_btn.png'),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: 'none',
                  }}
                  onClick={() => unlocked && handleClick(() => onSelectLevel(level.id))}
                  disabled={!unlocked}
                >
                  <div className="text-4xl font-bold text-center mb-1 text-yellow-200">
                    {unlocked ? level.id : '🔒'}
                  </div>
                  <div className="text-lg text-center text-yellow-200 mb-1">
                    {level.name}
                  </div>
                  {level.practiceLetters && (
                    <div className="text-sm text-center text-yellow-300 mb-2">
                      {formatPracticeLetters(level.practiceLetters)}
                    </div>
                  )}
                  {unlocked && renderStars(stars)}
                  {!unlocked && (
                    <div className="text-xs text-yellow-300 text-center mt-1">
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 text-lg font-bold text-yellow-200 transition-transform hover:scale-105 active:scale-95"
        style={{ 
          fontFamily: 'Zpix, monospace',
          backgroundImage: assetUrl('assets/ui/back_btn.png'),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: 'none',
          boxShadow: 'none',
        }}
        onClick={() => handleClick(onBack)}
      >
        返回主菜单
      </button>
    </div>
  );
}
