import type { EndlessMode } from '@/game/types/game';

interface EndlessModeDialogProps {
  onSelect: (mode: EndlessMode) => void;
  onCancel: () => void;
}

export default function EndlessModeDialog({ onSelect, onCancel }: EndlessModeDialogProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="panel p-8 bounce-in min-w-[420px]">
        <h2 className="text-4xl font-bold text-blue-400 glow-text mb-6 pixel-text text-center">
          🔄 无尽模式
        </h2>
        <p className="text-slate-300 text-center mb-6 pixel-text">
          选择挑战方式
        </p>

        <div className="flex flex-col gap-4">
          <button
            className="btn-game btn-primary w-full text-xl"
            onClick={() => onSelect('letter')}
          >
            🔤 字母模式
            <div className="text-sm font-normal opacity-80 mt-1">
              每次输入一个字母即可发射子弹
            </div>
          </button>

          <button
            className="btn-game btn-secondary w-full text-xl"
            onClick={() => onSelect('word')}
          >
            📝 单词模式
            <div className="text-sm font-normal opacity-80 mt-1">
              输入完整单词才能发射子弹，更具挑战
            </div>
          </button>

          <button
            className="btn-game w-full text-white"
            style={{ background: 'linear-gradient(to bottom, #64748b, #475569)', boxShadow: '0 4px 0 #334155, 0 6px 10px rgba(0,0,0,0.3)' }}
            onClick={onCancel}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
}
