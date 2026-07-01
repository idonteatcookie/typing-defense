interface PauseDialogProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export default function PauseDialog({ onResume, onRestart, onMenu }: PauseDialogProps) {
  return (
    <div className="panel p-8 text-center bounce-in min-w-[300px]">
      <h2 className="text-4xl font-bold text-yellow-400 glow-text mb-8 pixel-text">
        ⏸ 游戏暂停
      </h2>

      <div className="flex flex-col gap-4">
        <button className="btn-game btn-primary w-full" onClick={onResume}>
          ▶ 继续游戏
        </button>
        <button className="btn-game btn-secondary w-full" onClick={onRestart}>
          🔄 重新开始
        </button>
        <button
          className="btn-game w-full text-white"
          style={{ background: 'linear-gradient(to bottom, #64748b, #475569)', boxShadow: '0 4px 0 #334155, 0 6px 10px rgba(0,0,0,0.3)' }}
          onClick={onMenu}
        >
          🏠 返回主菜单
        </button>
      </div>
    </div>
  );
}
