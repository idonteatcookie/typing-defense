import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';
import { assetUrl } from '@/utils/asset';
import { useEffect } from 'react';

interface DefeatDialogProps {
  onRestart: () => void;
  onMenu: () => void;
}

export default function DefeatDialog({ onRestart, onMenu }: DefeatDialogProps) {
  const defeatData = useGameStore((state) => state.defeatData);
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const updateLevelProgress = useUserStore((state) => state.updateLevelProgress);
  const addTotalStats = useUserStore((state) => state.addTotalStats);

  useEffect(() => {
    if (defeatData && currentLevelId) {
      updateLevelProgress(currentLevelId, {});

      addTotalStats({
        totalKills: defeatData.kills,
        totalPlayTime: defeatData.time,
        totalKeystrokes: defeatData.stats.totalKeystrokes,
        totalCorrectKeystrokes: defeatData.stats.correctKeystrokes,
        totalGamesPlayed: 1,
        totalDefeats: 1,
      });
    }
  }, [defeatData, currentLevelId, updateLevelProgress, addTotalStats]);

  if (!defeatData) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="panel p-10 text-center bounce-in max-w-md">
      <h2 className="text-2xl font-bold text-red-400 mb-4 pixel-text">
        防线失守
      </h2>

      <p className="text-slate-300 mb-4 pixel-text text-lg">
        别灰心，再试一次吧！
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-left">
        <div className="stat-item">
          <span className="text-slate-400">击杀数</span>
          <span className="text-white font-bold ml-auto pixel-text">{defeatData.kills}</span>
        </div>
        <div className="stat-item">
          <span className="text-slate-400">坚持波次</span>
          <span className="text-orange-400 font-bold ml-auto pixel-text">{defeatData.waveReached}</span>
        </div>
        <div className="stat-item">
          <span className="text-slate-400">打字速度</span>
          <span className="text-green-400 font-bold ml-auto pixel-text">{defeatData.stats.wpm} WPM</span>
        </div>
        <div className="stat-item">
          <span className="text-slate-400">准确率</span>
          <span className="text-blue-400 font-bold ml-auto pixel-text">
            {Math.round(defeatData.stats.accuracy * 100)}%
          </span>
        </div>
        <div className="stat-item col-span-2">
          <span className="text-slate-400">用时</span>
          <span className="text-white font-bold ml-auto pixel-text">{formatTime(defeatData.time)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center">
        <button
          className="px-8 py-3 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
          style={{
            backgroundImage: assetUrl('assets/ui/select_btn.webp'),
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={onRestart}
        >
          重新挑战
        </button>
        <button
          className="px-4 py-2 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
          style={{
            backgroundImage: assetUrl('assets/ui/back_btn.webp'),
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={onMenu}
        >
          返回菜单
        </button>
      </div>
    </div>
  );
}
