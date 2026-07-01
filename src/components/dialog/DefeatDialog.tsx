import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';
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
    <div className="panel p-8 text-center bounce-in max-w-md">
      <h2 className="text-4xl font-bold text-red-400 glow-text mb-6 pixel-text">
        💀 防线失守...
      </h2>

      <p className="text-slate-300 mb-6 pixel-text text-lg">
        别灰心，再试一次吧！
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 text-left">
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

      <div className="flex flex-col gap-3">
        <button className="btn-game btn-primary w-full" onClick={onRestart}>
          🔄 重新挑战
        </button>
        <button
          className="btn-game w-full text-white"
          style={{ background: 'linear-gradient(to bottom, #64748b, #475569)', boxShadow: '0 4px 0 #334155, 0 6px 10px rgba(0,0,0,0.3)' }}
          onClick={onMenu}
        >
          返回菜单
        </button>
      </div>
    </div>
  );
}
