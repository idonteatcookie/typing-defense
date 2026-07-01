import { useGameStore } from '@/store/useGameStore';

interface TopBarProps {
  onPause: () => void;
}

export default function TopBar({ onPause }: TopBarProps) {
  const gold = useGameStore((state) => state.gold);
  const currentWave = useGameStore((state) => state.currentWave);
  const totalWaves = useGameStore((state) => state.totalWaves);
  const currentLevelId = useGameStore((state) => state.currentLevelId);

  return (
    <div className="w-full h-14 panel rounded-t-lg rounded-b-none border-t-0 border-x-0 border-b border-slate-600 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="stat-item">
          <span className="text-yellow-400 text-xl">💰</span>
          <span className="text-yellow-300 font-bold text-xl pixel-text">{gold}</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-slate-400 text-sm">关卡 {currentLevelId}</div>
        <div className="text-white font-bold pixel-text">
          波次 {currentWave} / {totalWaves}
        </div>
      </div>

      <button
        className="px-4 py-1 bg-slate-600 hover:bg-slate-500 rounded text-white transition-colors pixel-text"
        onClick={onPause}
      >
        ⏸ 暂停
      </button>
    </div>
  );
}
