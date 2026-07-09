import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';
import { assetUrl } from '@/utils/asset';
import { useEffect } from 'react';

interface VictoryDialogProps {
  onNextLevel: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export default function VictoryDialog({ onNextLevel, onRestart, onMenu }: VictoryDialogProps) {
  const victoryData = useGameStore((state) => state.victoryData);
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const updateLevelProgress = useUserStore((state) => state.updateLevelProgress);
  const addTotalStats = useUserStore((state) => state.addTotalStats);

  useEffect(() => {
    if (victoryData && currentLevelId) {
      updateLevelProgress(currentLevelId, {
        completed: true,
        stars: victoryData.stars,
        bestScore: victoryData.goldEarned * 10,
        bestWpm: victoryData.stats.wpm,
        bestAccuracy: victoryData.stats.accuracy,
      });

      addTotalStats({
        totalKills: victoryData.kills,
        totalGoldEarned: victoryData.goldEarned,
        totalPlayTime: victoryData.time,
        totalKeystrokes: victoryData.stats.totalKeystrokes,
        totalCorrectKeystrokes: victoryData.stats.correctKeystrokes,
        highestCombo: victoryData.stats.combo,
        totalGamesPlayed: 1,
        totalVictories: 1,
      });
    }
  }, [victoryData, currentLevelId, updateLevelProgress, addTotalStats]);

  if (!victoryData) return null;

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center mb-4">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`text-5xl ${i <= victoryData.stars ? 'text-yellow-400 glow-text' : 'text-slate-600'}`}
            style={{
              animation: i <= victoryData.stars ? `bounceIn 0.5s ease-out ${i * 0.2}s both` : 'none',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="panel p-10 text-center bounce-in max-w-md">
      <h2 className="text-2xl font-bold text-green-400 mb-4 pixel-text">
        关卡胜利
      </h2>

      {renderStars()}

      <div className="grid grid-cols-2 gap-4 mb-4 text-left">
        <div className="stat-item">
          <span className="text-slate-400">击杀数</span>
          <span className="text-white font-bold ml-auto pixel-text">{victoryData.kills}</span>
        </div>
        <div className="stat-item">
          <span className="text-slate-400">获得金币</span>
          <span className="text-yellow-400 font-bold ml-auto pixel-text">{victoryData.goldEarned}</span>
        </div>
        <div className="stat-item">
          <span className="text-slate-400">打字速度</span>
          <span className="text-green-400 font-bold ml-auto pixel-text">{victoryData.stats.wpm} WPM</span>
        </div>
        <div className="stat-item">
          <span className="text-slate-400">准确率</span>
          <span className="text-blue-400 font-bold ml-auto pixel-text">
            {Math.round(victoryData.stats.accuracy * 100)}%
          </span>
        </div>
        <div className="stat-item">
          <span className="text-slate-400">最高连击</span>
          <span className="text-orange-400 font-bold ml-auto pixel-text">{victoryData.stats.combo}</span>
        </div>
        <div className="stat-item">
          <span className="text-slate-400">用时</span>
          <span className="text-white font-bold ml-auto pixel-text">{formatTime(victoryData.time)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center">
        <button
          className="px-8 py-3 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
          style={{
            backgroundImage: assetUrl('assets/ui/select_btn.png'),
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={onNextLevel}
        >
          下一关 →
        </button>
        <div className="flex gap-3">
          <button
            className="px-6 py-3 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
            style={{
              backgroundImage: assetUrl('assets/ui/select_btn.png'),
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={onRestart}
          >
            再玩一次
          </button>
          <button
            className="px-4 py-2 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
            style={{
              backgroundImage: assetUrl('assets/ui/back_btn.png'),
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={onMenu}
          >
            返回菜单
          </button>
        </div>
      </div>
    </div>
  );
}
