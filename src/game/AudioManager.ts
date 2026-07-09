import { asset } from '@/utils/asset';

export class AudioManager {
  private static instance: AudioManager;
  private bgmAudio: HTMLAudioElement | null = null;
  private currentBgmPath: string | null = null;
  private bgmMuted = false;
  private sfxMuted = false;
  private bgmVolume = 0.3;
  private sfxVolume = 0.3;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setBgmMuted(muted: boolean): void {
    this.bgmMuted = muted;
    if (muted) {
      this.stopBgm();
    }
  }

  setSfxMuted(muted: boolean): void {
    this.sfxMuted = muted;
  }

  setBgmVolume(volume: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume;
    }
  }

  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  isBgmMuted(): boolean {
    return this.bgmMuted;
  }

  isSfxMuted(): boolean {
    return this.sfxMuted;
  }

  private playBgm(path: string): void {
    if (this.bgmMuted) return;

    if (!this.bgmAudio || this.currentBgmPath !== path) {
      this.stopBgm();
      this.bgmAudio = new Audio(asset(path));
      this.currentBgmPath = path;
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
    }

    if (this.bgmAudio.paused) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  startBgm(): void {
    this.playBgm('assets/audio/bgm.mp3');
  }

  startHomeBgm(): void {
    this.playBgm('assets/audio/home.mp3');
  }

  stopBgm(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }

  pauseBgm(): void {
    if (this.bgmAudio && !this.bgmAudio.paused) {
      this.bgmAudio.pause();
    }
  }

  resumeBgm(): void {
    if (this.bgmMuted) return;
    if (this.bgmAudio && this.bgmAudio.paused) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  private playSfx(path: string, volumeScale = 1): void {
    if (this.sfxMuted) return;
    const audio = new Audio(asset(path));
    audio.volume = this.sfxVolume * volumeScale;
    audio.play().catch(() => {});
  }

  playBulletSound(): void {
    this.playSfx('assets/audio/bullet.mp3');
  }

  playArrowSound(): void {
    this.playSfx('assets/audio/arrow.mp3');
  }

  playTowerSound(soundFile: string): void {
    this.playSfx(`assets/audio/${soundFile}`);
  }

  playHitSound(): void {
    this.playSfx('assets/audio/hit.mp3');
  }

  playCorrectSound(): void {
    this.playSfx('assets/audio/correct.mp3', 0.7);
  }

  playWrongSound(): void {
    this.playSfx('assets/audio/error.mp3');
  }

  playButtonSound(): void {
    this.playSfx('assets/audio/button.mp3');
  }

  playDeathSound(): void {
    this.playSfx('assets/audio/death.mp3', 1.3);
  }

  playVictorySound(): void {
    if (this.sfxMuted) return;
    this.stopBgm();
    this.playSfx('assets/audio/victory.mp3', 1.5);
  }

  playDefeatSound(): void {
    if (this.sfxMuted) return;
    this.stopBgm();
    this.playSfx('assets/audio/defeat.mp3', 1.5);
  }

  toggleMute(): boolean {
    const muted = !this.bgmMuted && !this.sfxMuted;
    this.bgmMuted = muted;
    this.sfxMuted = muted;
    if (muted) {
      this.stopBgm();
    }
    return muted;
  }

  getMuted(): boolean {
    return this.bgmMuted && this.sfxMuted;
  }

  stopAll(): void {
    this.stopBgm();
  }
}

export const audioManager = AudioManager.getInstance();
