export class AudioManager {
  private static instance: AudioManager;
  private bgmAudio: HTMLAudioElement | null = null;
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

  startBgm(): void {
    if (this.bgmMuted) return;

    if (!this.bgmAudio || this.bgmAudio.src !== '/assets/audio/bgm.mp3') {
      this.stopBgm();
      this.bgmAudio = new Audio('/assets/audio/bgm.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
    }

    if (this.bgmAudio.paused) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  startHomeBgm(): void {
    if (this.bgmMuted) return;

    if (!this.bgmAudio || this.bgmAudio.src !== '/assets/audio/home.mp3') {
      this.stopBgm();
      this.bgmAudio = new Audio('/assets/audio/home.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
    }

    if (this.bgmAudio.paused) {
      this.bgmAudio.play().catch(() => {});
    }
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

  playBulletSound(): void {
    if (this.sfxMuted) return;
    const audio = new Audio('/assets/audio/bullet.mp3');
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  }

  playArrowSound(): void {
    if (this.sfxMuted) return;
    const audio = new Audio('/assets/audio/arrow.mp3');
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  }

  playTowerSound(soundFile: string): void {
    if (this.sfxMuted) return;
    const audio = new Audio(`/assets/audio/${soundFile}`);
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  }

  playHitSound(): void {
    if (this.sfxMuted) return;
    const audio = new Audio('/assets/audio/hit.mp3');
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  }

  playCorrectSound(): void {
    if (this.sfxMuted) return;
    const audio = new Audio('/assets/audio/correct.mp3');
    audio.volume = this.sfxVolume * 0.7;
    audio.play().catch(() => {});
  }

  playWrongSound(): void {
    if (this.sfxMuted) return;
    const audio = new Audio('/assets/audio/error.mp3');
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  }

  playButtonSound(): void {
    if (this.sfxMuted) return;
    const audio = new Audio('/assets/audio/button.mp3');
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  }

  playDeathSound(): void {
    if (this.sfxMuted) return;
    const audio = new Audio('/assets/audio/death.mp3');
    audio.volume = this.sfxVolume * 1.3;
    audio.play().catch(() => {});
  }

  playVictorySound(): void {
    if (this.sfxMuted) return;
    this.stopBgm();
    const audio = new Audio('/assets/audio/victory.mp3');
    audio.volume = this.sfxVolume * 1.5;
    audio.play().catch(() => {});
  }

  playDefeatSound(): void {
    if (this.sfxMuted) return;
    this.stopBgm();
    const audio = new Audio('/assets/audio/defeat.mp3');
    audio.volume = this.sfxVolume * 1.5;
    audio.play().catch(() => {});
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
