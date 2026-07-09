import { useGameStore } from '@/store/useGameStore';
import { gameManager } from '@/game/GameManager';

interface TopBarProps {
  onPause: () => void;
  onSpeedToggle: () => void;
  isPaused: boolean;
}

export default function TopBar({ onPause, onSpeedToggle, isPaused }: TopBarProps) {
  const gold = useGameStore((state) => state.gold);
  const kills = useGameStore((state) => state.kills);
  const currentWave = useGameStore((state) => state.currentWave);
  const totalWaves = useGameStore((state) => state.totalWaves);
  const currentLevelId = useGameStore((state) => state.currentLevelId);
  const speedMultiplier = useGameStore((state) => state.speedMultiplier);

  const isEndless = gameManager.levelManager.isEndless();
  const currentLevel = gameManager.levelManager.getCurrentLevel();
  const titleText = isEndless
    ? '无尽模式'
    : `关卡${currentLevelId} - ${currentLevel?.name || ''}`;

  const currentWaveMonsterCount = gameManager.getCurrentWaveMonsterCount();

  const getWaveProgress = (waveNum: number) => {
    if (waveNum < currentWave) return 100;
    if (waveNum > currentWave) return 0;
    if (currentWaveMonsterCount === 0) return 0;
    const monstersInPreviousWaves = gameManager.getMonsterCountUpToWave(currentWave - 1);
    const monstersKilledInCurrentWave = kills - monstersInPreviousWaves;
    return Math.min(100, Math.max(0, (monstersKilledInCurrentWave / currentWaveMonsterCount) * 100));
  };

  return (
    <div className="w-full h-16 flex items-center justify-center px-2 relative">
      <div style={{ width: '535px' }} className="flex items-center justify-center">
        <h1
          className="text-2xl font-bold pixel-text"
          style={{ fontFamily: 'Zpix, monospace', color: '#92400e' }}
        >
          {titleText}
        </h1>
      </div>

      <div style={{ width: '260px' }} className="flex items-center justify-center">
        <span
          className="text-yellow-300 font-bold text-xl"
          style={{ fontFamily: 'Zpix, monospace' }}
        >
          金币：{gold}
        </span>
      </div>

      <div style={{ width: '535px' }} className="flex items-center justify-center">
        <div style={{ width: '300px' }} className="flex items-center gap-3">
          <span
            className="text-slate-400 text-xs whitespace-nowrap"
            style={{ fontFamily: 'Zpix, monospace' }}
          >
            波次进度
          </span>
          <div className="relative flex-1 h-4">
            <div className="absolute top-1.5 left-0 right-0 h-1 bg-[#92400e] rounded-full" />
            
            {(() => {
              const monstersInPreviousWaves = gameManager.getMonsterCountUpToWave(currentWave - 1);
              const monstersKilledInCurrentWave = kills - monstersInPreviousWaves;
              const currentWaveProgress = currentWaveMonsterCount > 0
                ? monstersKilledInCurrentWave / currentWaveMonsterCount
                : 0;
              const completedWaveProgress = (currentWave - 1) / totalWaves;
              const totalProgress = completedWaveProgress + (currentWaveProgress / totalWaves);
              return (
                <div
                  className="absolute top-1.5 left-0 h-1 bg-green-500 rounded-full transition-all duration-200"
                  style={{
                    width: `${Math.min(100, Math.max(0, totalProgress * 100))}%`,
                  }}
                />
              );
            })()}
            
            {(() => {
              const monstersInPreviousWaves = gameManager.getMonsterCountUpToWave(currentWave - 1);
              const monstersKilledInCurrentWave = kills - monstersInPreviousWaves;
              const isCurrentWaveCompleted = currentWaveMonsterCount > 0 && monstersKilledInCurrentWave >= currentWaveMonsterCount;
              
              return Array.from({ length: totalWaves }).map((_, i) => {
                const waveNum = i + 1;
                const isCompleted = waveNum < currentWave || (waveNum === currentWave && isCurrentWaveCompleted);
                const isActive = waveNum === currentWave && !isCurrentWaveCompleted;
                const position = totalWaves === 1 ? 50 : ((i + 1) / totalWaves) * 100;
                return (
                  <div
                    key={i}
                    className="absolute top-0"
                    style={{
                      left: `${position}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 transition-all duration-300"
                      style={{
                        backgroundColor: isCompleted ? '#22c55e' : isActive ? '#fde047' : '#92400e',
                        borderColor: isCompleted ? '#16a34a' : isActive ? '#facc15' : '#78350f',
                        boxShadow: isActive ? '0 0 6px rgba(250, 204, 21, 0.6)' : 'none',
                      }}
                    />
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2" style={{ width: '150px', justifyContent: 'center' }}>
        <button
          className="w-10 h-10 p-0 rounded-md overflow-hidden transition-transform hover:scale-95 active:scale-90"
          onClick={onSpeedToggle}
        >
          <img
            src={`/assets/ui/${speedMultiplier === 2 ? 'double_speed.png' : 'origin_speed.png'}`}
            alt={speedMultiplier === 2 ? '恢复原速' : '加速'}
            className="w-full h-full object-contain"
          />
        </button>
        <button
          className="w-10 h-10 p-0 rounded-md overflow-hidden transition-transform hover:scale-95 active:scale-90"
          onClick={onPause}
        >
          <img
            src={`/assets/ui/${isPaused ? 'continue.png' : 'pause.png'}`}
            alt={isPaused ? '继续' : '暂停'}
            className="w-full h-full object-contain"
          />
        </button>
      </div>
    </div>
  );
}
