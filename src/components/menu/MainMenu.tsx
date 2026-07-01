interface MainMenuProps {
  onStart: () => void;
}

export default function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-12">
      <div className="text-center bounce-in">
        <h1 className="text-6xl font-bold text-green-400 glow-text pixel-text mb-4">
          盲打防线
        </h1>
        <p className="text-2xl text-slate-300 pixel-text">
          Typing Defense
        </p>
      </div>

      <div className="flex flex-col gap-4 w-64 mt-8">
        <button
          className="btn-game btn-primary text-2xl"
          onClick={onStart}
        >
          开始游戏
        </button>

        <button
          className="btn-game btn-secondary text-xl"
          onClick={() => {}}
        >
          设置
        </button>

        <button
          className="btn-game text-lg bg-slate-600 text-white"
          style={{ boxShadow: '0 4px 0 #334155, 0 6px 10px rgba(0,0,0,0.3)' }}
          onClick={() => {}}
        >
          关于游戏
        </button>
      </div>

      <div className="mt-8 text-slate-400 text-center">
        <p className="text-lg">用打字的力量守护你的基地！</p>
        <p className="text-sm mt-2 opacity-70">快速输入字母消灭怪物，建造防御塔阻挡敌人</p>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-green-500/10 blur-2xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-yellow-500/10 blur-2xl" />
    </div>
  );
}
