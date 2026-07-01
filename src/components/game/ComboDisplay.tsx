import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { eventBus } from '@/game/EventBus';
import { EVENT_NAMES } from '@/constants/eventNames';

export default function ComboDisplay() {
  const combo = useGameStore((state) => state.combo);
  const [pulse, setPulse] = useState(false);
  const [shake, setShake] = useState(false);
  const prevComboRef = useRef(0);

  const getComboLevel = () => {
    if (combo >= 50) return 4;
    if (combo >= 20) return 3;
    if (combo >= 10) return 2;
    if (combo >= 5) return 1;
    return 0;
  };

  const level = getComboLevel();

  useEffect(() => {
    const handleCorrect = (data: { combo: number }) => {
      const newLevel = getComboLevelFromNum(data.combo);
      const oldLevel = getComboLevelFromNum(prevComboRef.current);

      if (data.combo > prevComboRef.current) {
        setPulse(true);
        setTimeout(() => setPulse(false), 300);

        if (newLevel > oldLevel && newLevel >= 2) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      }

      prevComboRef.current = data.combo;
    };

    const handleWrong = () => {
      prevComboRef.current = 0;
    };

    eventBus.on(EVENT_NAMES.TYPING_CORRECT, handleCorrect);
    eventBus.on(EVENT_NAMES.TYPING_WRONG, handleWrong);

    return () => {
      eventBus.off(EVENT_NAMES.TYPING_CORRECT, handleCorrect);
      eventBus.off(EVENT_NAMES.TYPING_WRONG, handleWrong);
    };
  }, []);

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

  if (combo < 3) return null;

  return (
    <div className="absolute top-16 right-4 text-right z-20 pointer-events-none">
      <div
        className={`
          ${getComboColor()} 
          ${getComboSize()} 
          font-bold 
          pixel-text
          ${level >= 2 ? 'combo-text-glow' : ''}
          ${pulse ? 'combo-text-pulse' : ''}
          ${shake || level >= 3 ? 'combo-text-shake' : ''}
        `}
      >
        {combo} COMBO!
      </div>
      {combo >= 5 && (
        <div className="text-sm text-slate-300 pixel-text mt-1">
          伤害 +{Math.round((combo >= 50 ? 100 : combo >= 20 ? 50 : combo >= 10 ? 25 : 10))}%
        </div>
      )}
      {level >= 2 && (
        <div className="text-xs text-slate-400 pixel-text mt-1 opacity-70">
          {level === 2 && '⚡ 狂热模式'}
          {level === 3 && '🔥 狂暴模式'}
          {level === 4 && '💀 无敌模式'}
        </div>
      )}
    </div>
  );
}

function getComboLevelFromNum(combo: number): number {
  if (combo >= 50) return 4;
  if (combo >= 20) return 3;
  if (combo >= 10) return 2;
  if (combo >= 5) return 1;
  return 0;
}