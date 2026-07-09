import type { EndlessMode } from '@/game/types/game';

interface EndlessModeDialogProps {
  onSelect: (mode: EndlessMode) => void;
  onCancel: () => void;
}

export default function EndlessModeDialog({ onSelect, onCancel }: EndlessModeDialogProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="panel p-10 bounce-in min-w-[420px]">
        <h2 className="text-2xl font-bold text-blue-400 mb-4 pixel-text text-center">
          无尽模式
        </h2>
        <p className="text-slate-300 text-center mb-4 pixel-text">
          选择挑战方式
        </p>

        <div className="flex flex-col gap-3 items-center">
          <button
            className="px-8 py-3 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
            style={{
              backgroundImage: "url('/assets/ui/select_btn.png')",
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={() => onSelect('letter')}
          >
            字母模式
            <div className="text-sm font-normal opacity-80 mt-1 pixel-text">
              每次输入一个字母即可发射子弹
            </div>
          </button>

          <button
            className="px-8 py-3 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
            style={{
              backgroundImage: "url('/assets/ui/select_btn.png')",
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={() => onSelect('word')}
          >
            单词模式
            <div className="text-sm font-normal opacity-80 mt-1 pixel-text">
              输入完整单词才能发射子弹，更具挑战
            </div>
          </button>

          <button
            className="px-4 py-2 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
            style={{
              backgroundImage: "url('/assets/ui/back_btn.png')",
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={onCancel}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
}
