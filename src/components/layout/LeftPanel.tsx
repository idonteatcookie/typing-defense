import { useGameStore } from '@/store/useGameStore';
import { gameManager } from '@/game/GameManager';
import { TOWER_CONFIGS } from '@/game/config/TowerConfig';
import { asset, assetUrl } from '@/utils/asset';

export default function LeftPanel() {
  const gold = useGameStore((state) => state.gold);
  const placingTowerType = useGameStore((state) => state.placingTowerType);
  const startPlacingTower = useGameStore((state) => state.startPlacingTower);
  const cancelPlacingTower = useGameStore((state) => state.cancelPlacingTower);

  const availableTowers = gameManager.getAvailableTowers();

  const handleTowerClick = (type: string, canAfford: boolean) => {
    if (!canAfford) return;
    if (placingTowerType === type) {
      cancelPlacingTower();
    } else {
      startPlacingTower(type as any);
    }
  };

  return (
    <div
      className="w-[180px] p-6 overflow-y-auto flex-shrink-0"
      style={{
        backgroundImage: assetUrl('assets/ui/sidebar.webp'),
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex flex-col gap-2">
        {availableTowers.map((type) => {
          const config = TOWER_CONFIGS[type];
          const canAfford = gold >= config.cost;
          const isSelected = placingTowerType === type;
          const spriteName = config.sprite?.replace('tower_', '') || 'tower';
          const imagePath = asset(`assets/towers/${spriteName}.webp`);

          return (
            <div
              key={type}
              className={`tower-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}`}
              onClick={() => handleTowerClick(type, canAfford)}
            >
              {isSelected && (
                <div className="tower-selected-badge">✓</div>
              )}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: config.color + '40', border: `2px solid ${config.color}` }}
                >
                  <img
                    src={imagePath}
                    alt={config.name}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div
                  className="text-yellow-400 text-base pixel-text"
                  style={{ fontFamily: 'Zpix, monospace' }}
                >
                  💰 {config.cost}
                </div>
              </div>
              <div
                className="text-white font-bold text-sm mb-1 pixel-text"
                style={{ fontFamily: 'Zpix, monospace' }}
              >
                {config.name}
              </div>
              <div
                className="text-xs text-slate-400 pixel-text"
                style={{ fontFamily: 'Zpix, monospace' }}
              >
                {config.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
