import { useGameStore } from '@/store/useGameStore';

export default function ComboDisplay() {
  const combo = useGameStore((state) => state.combo);

  if (combo < 3) return null;

  const getComboColor = () => {
    if (combo >= 50) return 'text-red-400';
    if (combo >= 20) return 'text-purple-400';
    if (combo >= 10) return 'text-orange-400';
    return 'text-yellow-400';
  };

  const getComboSize = () => {
    if (combo >= 50) return 'text-6xl';
    if (combo >= 20) return 'text-5xl';
    if (combo >= 10) return 'text-4xl';
    return 'text-3xl';
  };

  return (
    <div className="absolute top-16 right-4 text-right z-20 pointer-events-none">
      <div className={`${getComboColor()} ${getComboSize()} font-bold glow-text pixel-text`}>
        {combo} COMBO!
      </div>
      {combo >= 5 && (
        <div className="text-sm text-slate-300 pixel-text">
          伤害 +{Math.round((combo >= 50 ? 100 : combo >= 20 ? 50 : combo >= 10 ? 25 : 10))}%
        </div>
      )}
    </div>
  );
}
