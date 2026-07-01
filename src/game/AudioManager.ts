export class AudioManager {
  private static instance: AudioManager;
  private bgmAudio: HTMLAudioElement | null = null;
  private isMuted = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  startBgm(): void {
    if (this.isMuted) return;

    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('/assets/audio/bgm.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.3;
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
    if (this.isMuted) return;
    if (this.bgmAudio && this.bgmAudio.paused) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  playBulletSound(): void {
    if (this.isMuted) return;
    const audio = new Audio('/assets/audio/bullet.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  playHitSound(): void {
    if (this.isMuted) return;
    const audio = new Audio('/assets/audio/hit.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  playCorrectSound(): void {
    if (this.isMuted) return;
    const audio = new Audio('/assets/audio/correct.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  }

  playWrongSound(): void {
    if (this.isMuted) return;
    const audio = new Audio('/assets/audio/error.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  playDeathSound(): void {
    if (this.isMuted) return;
    const audio = new Audio('/assets/audio/death.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }

  playVictorySound(): void {
    if (this.isMuted) return;
    this.stopBgm();
    const audio = new Audio('/assets/audio/victory.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }

  playDefeatSound(): void {
    if (this.isMuted) return;
    this.stopBgm();
    const audio = new Audio('/assets/audio/defeat.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    }
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  stopAll(): void {
    this.stopBgm();
  }
}

export const audioManager = AudioManager.getInstance();