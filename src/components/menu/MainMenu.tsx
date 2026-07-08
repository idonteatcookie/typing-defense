import { useEffect } from 'react';
import { audioManager } from '@/game/AudioManager';

interface MainMenuProps {
  onStart: () => void;
  onEndless: () => void;
  onSettings: () => void;
  onAbout: () => void;
}

export default function MainMenu({ onStart, onEndless, onSettings, onAbout }: MainMenuProps) {
  useEffect(() => {
    audioManager.startHomeBgm();
    return () => {
      audioManager.stopBgm();
    };
  }, []);

  const handleClick = (callback: () => void) => {
    audioManager.playButtonSound();
    callback();
  };

  return (
    <div
      className="relative w-full h-full"
      style={{
        backgroundImage: `url('/assets/ui/background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0 panel-drop-down"
        style={{
          backgroundImage: `url('/assets/ui/panel.png')`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 text-center z-10">
          <h1 className="text-4xl font-bold text-amber-700 pixel-text drop-shadow-lg" style={{ fontFamily: 'Zpix, monospace' }}>
            盲打防线
          </h1>
        </div>

        <div className="absolute top-[30.5%] left-1/2 -translate-x-1/2 flex flex-col gap-10 z-10">
          <button
            className="px-12 py-3 text-2xl font-bold text-amber-900 pixel-text transition-all duration-200 transform hover:scale-105 active:scale-95"
            style={{ fontFamily: 'Zpix, monospace' }}
            onClick={() => handleClick(onStart)}
          >
            闯关模式
          </button>

          <button
            className="px-12 py-3 text-2xl font-bold text-amber-900 pixel-text transition-all duration-200 transform hover:scale-105 active:scale-95"
            style={{ fontFamily: 'Zpix, monospace' }}
            onClick={() => handleClick(onEndless)}
          >
            无尽模式
          </button>

          <button
            className="px-12 py-3 text-2xl font-bold text-amber-900 pixel-text transition-all duration-200 transform hover:scale-105 active:scale-95"
            style={{ fontFamily: 'Zpix, monospace' }}
            onClick={() => handleClick(onSettings)}
          >
            游戏设置
          </button>

          <button
            className="px-12 py-3 text-2xl font-bold text-amber-900 pixel-text transition-all duration-200 transform hover:scale-105 active:scale-95"
            style={{ fontFamily: 'Zpix, monospace' }}
            onClick={() => handleClick(onAbout)}
          >
            游戏介绍
          </button>
        </div>
      </div>
    </div>
  );
}
