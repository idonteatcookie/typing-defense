interface PauseDialogProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export default function PauseDialog({ onResume, onRestart, onMenu }: PauseDialogProps) {
  return (
    <div className="panel p-4 text-center bounce-in min-w-[300px]">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 pixel-text">
        游戏暂停
      </h2>

      <div className="flex flex-col gap-3 items-center">
        <button
          className="px-8 py-3 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
          style={{
            backgroundImage: "url('/assets/ui/select_btn.png')",
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={onResume}
        >
          继续游戏
        </button>
        <button
          className="px-8 py-3 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
          style={{
            backgroundImage: "url('/assets/ui/select_btn.png')",
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={onRestart}
        >
          重新开始
        </button>
        <button
          className="px-4 py-2 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
          style={{
            backgroundImage: "url('/assets/ui/back_btn.png')",
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
          onClick={onMenu}
        >
          返回主菜单
        </button>
      </div>
    </div>
  );
}
