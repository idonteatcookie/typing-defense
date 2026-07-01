import { useGameStore } from '@/store/useGameStore';
import { gameManager } from '@/game/GameManager';
import { TOWER_CONFIGS } from '@/game/config/TowerConfig';

export default function LeftPanel() {
  const gold = useGameStore((state) => state.gold);
  const placingTowerType = useGameStore((state) => state.placingTowerType);
  const startPlacingTower = useGameStore((state) => state.startPlacingTower);
  const cancelPlacingTower = useGameStore((state) => state.cancelPlacingTower);

  const availableTowers = gameManager.getAvailableTowers();

  return (
    <div className="w-48 panel rounded-none border-l-0 border-t-0 border-b-0 border-r border-slate-600 p-3 overflow-y-auto flex-shrink-0">
      <h3 className="text-white font-bold text-lg mb-3 pixel-text text-center border-b border-slate-600 pb-2">
        🏰 防御塔
      </h3>

      <div className="flex flex-col gap-2">
        {availableTowers.map((type) => {
          const config = TOWER_CONFIGS[type];
          const canAfford = gold >= config.cost;
          const isSelected = placingTowerType === type;

          return (
            <div
              key={type}
              className={`tower-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}`}
              onClick={() => {
                if (!canAfford) return;
                if (isSelected) {
                  cancelPlacingTower();
                } else {
                  startPlacingTower(type);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: config.color + '40', border: `2px solid ${config.color}` }}
                >
                  {type === 'arrow' && '🏹'}
                  {type === 'magic' && '🔮'}
                  {type === 'ice' && '❄️'}
                  {type === 'sniper' && '🎯'}
                  {type === 'gold' && '💰'}
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold pixel-text">{config.name}</div>
                  <div className="text-yellow-400 text-sm pixel-text">
                    💰 {config.cost}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-2">
                {config.description}
              </div>
            </div>
          );
        })}
      </div>

      {placingTowerType && (
        <div className="mt-4 p-2 bg-green-900/30 rounded border border-green-500/50 text-center">
          <p className="text-green-300 text-sm pixel-text">点击地图放置</p>
          <p className="text-slate-400 text-xs mt-1">按 ESC 取消</p>
        </div>
      )}
    </div>
  );
}
