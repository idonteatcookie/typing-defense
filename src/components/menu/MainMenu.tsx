import { useEffect } from 'react';
import { audioManager } from '@/game/AudioManager';
import { assetUrl } from '@/utils/asset';

interface MainMenuProps {
  onStart: () => void;
  onEndless: () => void;
  onSettings: () => void;
  onAbout: () => void;
}

export default function MainMenu({ onStart, onEndless, onSettings, onAbout }: MainMenuProps) {
  useEffect(() => {
    const tryPlay = () => audioManager.startHomeBgm();

    // 立即尝试播放（如果已有用户交互则成功）
    tryPlay();

    // 浏览器自动播放策略：首次用户交互时再尝试播放
    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
    window.addEventListener('click', onFirstInteraction);
    window.addEventListener('keydown', onFirstInteraction);

    return () => {
      audioManager.stopBgm();
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
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
        backgroundImage: assetUrl('assets/ui/background.png'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 flex justify-center">
        <div
          className="panel-drop-down relative"
          style={{
            width: '800px',
            height: '800px',
            backgroundImage: assetUrl('assets/ui/panel.png'),
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute top-[13%] left-1/2 -translate-x-1/2 text-center z-10">
            <h1 className="text-4xl font-bold text-amber-700 pixel-text drop-shadow-lg" style={{ fontFamily: 'Zpix, monospace' }}>
              盲打防线
            </h1>
            <p className="text-2xl">Typing Defense</p>
          </div>

          <div className="absolute top-[31.5%] left-1/2 -translate-x-1/2 flex flex-col gap-12 z-10">
            <button
              className="px-32 py-4 text-2xl font-bold text-amber-900 pixel-text transition-all duration-200 transform hover:scale-105 active:scale-95"
              style={{ fontFamily: 'Zpix, monospace' }}
              onClick={() => handleClick(onStart)}
            >
              闯关模式
            </button>

            <button
              className="px-32 py-4 text-2xl font-bold text-amber-900 pixel-text transition-all duration-200 transform hover:scale-105 active:scale-95"
              style={{ fontFamily: 'Zpix, monospace' }}
              onClick={() => handleClick(onEndless)}
            >
              无尽模式
            </button>

            <button
              className="px-32 py-4 text-2xl font-bold text-amber-900 pixel-text transition-all duration-200 transform hover:scale-105 active:scale-95"
              style={{ fontFamily: 'Zpix, monospace' }}
              onClick={() => handleClick(onSettings)}
            >
              游戏设置
            </button>

            <button
              className="px-32 py-4 text-2xl font-bold text-amber-900 pixel-text transition-all duration-200 transform hover:scale-105 active:scale-95"
              style={{ fontFamily: 'Zpix, monospace' }}
              onClick={() => handleClick(onAbout)}
            >
              游戏介绍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
