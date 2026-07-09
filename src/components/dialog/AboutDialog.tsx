interface AboutDialogProps {
  onClose: () => void;
}

export default function AboutDialog({ onClose }: AboutDialogProps) {
  return (
    <div className="panel p-10 bounce-in min-w-[420px]">
      <h2 className="text-2xl font-bold text-green-400 mb-4 pixel-text text-center">
        关于游戏
      </h2>

      <div className="flex flex-col gap-4 text-slate-200 pixel-text">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">盲打防线</div>
          <div className="text-lg text-slate-400">Typing Defense</div>
        </div>

        <div className="border-t border-slate-600 my-2" />

        <div className="text-lg leading-relaxed">
          <p>将<strong className="text-green-400">盲打练习</strong>与<strong className="text-blue-400">塔防游戏</strong>结合的创意玩法。</p>
        </div>

        <div className="text-base leading-relaxed text-slate-300">
          <p>• 键盘输入字母/单词，操控炮塔攻击怪物</p>
          <p>• 击杀怪物获得金币，建造防御塔协同作战</p>
          <p>• 52 个关卡循序渐进，从基准键位到标点符号</p>
          <p>• 无尽模式挑战你的极限打字速度</p>
        </div>

        <div className="border-t border-slate-600 my-2" />

        <div className="text-center">
          <div className="text-sm text-slate-400 mb-1">作者</div>
          <div className="text-2xl text-yellow-400 font-bold">我不吃饼干</div>
        </div>

        <div className="flex justify-center mt-2">
          <button
            className="px-4 py-2 pixel-text text-yellow-200 text-xl hover:scale-105 active:scale-95 transition-transform"
            style={{
              backgroundImage: "url('/assets/ui/back_btn.png')",
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={onClose}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
}
