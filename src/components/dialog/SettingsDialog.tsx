import { useSettingsStore } from '@/store/useSettingsStore';
import { audioManager } from '@/game/AudioManager';
import { assetUrl } from '@/utils/asset';

interface SettingsDialogProps {
  onClose: () => void;
}

export default function SettingsDialog({ onClose }: SettingsDialogProps) {
  const settings = useSettingsStore((state) => state.settings);
  const updateSetting = useSettingsStore((state) => state.updateSetting);

  const handleBgmToggle = () => {
    const next = !settings.bgmMuted;
    updateSetting('bgmMuted', next);
    audioManager.setBgmMuted(next);
  };

  const handleSfxToggle = () => {
    const next = !settings.sfxMuted;
    updateSetting('sfxMuted', next);
    audioManager.setSfxMuted(next);
    if (!next) {
      audioManager.playWrongSound();
    }
  };

  const handleBgmVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    updateSetting('bgmVolume', value);
    audioManager.setBgmVolume(value);
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    updateSetting('sfxVolume', value);
    audioManager.setSfxVolume(value);
  };

  return (
    <div className="panel p-10 bounce-in min-w-[380px]">
      <h2 className="text-2xl font-bold text-blue-400 mb-4 pixel-text text-center">
        游戏设置
      </h2>

      <div className="flex flex-col gap-5">
        {/* 背景音乐开关 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎵</span>
            <span className="text-white text-xl pixel-text">背景音乐</span>
          </div>
          <button
            className={`w-14 h-8 rounded-full relative transition-all duration-200 ${
              settings.bgmMuted
                ? 'bg-slate-600'
                : 'bg-gradient-to-r from-green-400 to-green-500'
            }`}
            onClick={handleBgmToggle}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-200 ${
                settings.bgmMuted ? 'left-1' : 'left-7'
              }`}
            />
          </button>
        </div>

        {/* 背景音乐音量 */}
        <div className="flex items-center gap-3 pl-10">
          <span className="text-slate-400 pixel-text w-12">音量</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.bgmVolume}
            onChange={handleBgmVolumeChange}
            disabled={settings.bgmMuted}
            className="flex-1 accent-green-500"
          />
          <span className="text-slate-300 pixel-text w-10 text-right">
            {Math.round(settings.bgmVolume * 100)}%
          </span>
        </div>

        {/* 音效开关 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔊</span>
            <span className="text-white text-xl pixel-text">游戏音效</span>
          </div>
          <button
            className={`w-14 h-8 rounded-full relative transition-all duration-200 ${
              settings.sfxMuted
                ? 'bg-slate-600'
                : 'bg-gradient-to-r from-green-400 to-green-500'
            }`}
            onClick={handleSfxToggle}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-200 ${
                settings.sfxMuted ? 'left-1' : 'left-7'
              }`}
            />
          </button>
        </div>

        {/* 音效音量 */}
        <div className="flex items-center gap-3 pl-10">
          <span className="text-slate-400 pixel-text w-12">音量</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.sfxVolume}
            onChange={handleSfxVolumeChange}
            disabled={settings.sfxMuted}
            className="flex-1 accent-green-500"
          />
          <span className="text-slate-300 pixel-text w-10 text-right">
            {Math.round(settings.sfxVolume * 100)}%
          </span>
        </div>

        <div className="mt-2 flex justify-center">
          <button
            className="px-6 py-2 pixel-text text-yellow-200 text-xl text-center hover:scale-105 active:scale-95 transition-transform"
            style={{
              backgroundImage: assetUrl('assets/ui/back_btn.png'),
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
