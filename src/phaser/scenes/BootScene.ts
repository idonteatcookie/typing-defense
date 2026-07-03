import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '@/constants/gameConstants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(GAME_WIDTH / 2 - 160, GAME_HEIGHT / 2 - 25, 320, 50);

    const loadingText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, '加载中...', {
      fontSize: '24px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    const percentText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '0%', {
      fontSize: '20px',
      color: '#ffffff',
    });
    percentText.setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x22c55e, 1);
      progressBar.fillRect(GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2 - 15, 300 * value, 30);
      percentText.setText(Math.round(value * 100) + '%');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    this.load.image('slime', '/assets/monsters/slime.png');
    this.load.image('runner', '/assets/monsters/runner.png');
    this.load.image('tank', '/assets/monsters/tank.png');
    this.load.image('tower', '/assets/towers/tower.png');
    this.load.image('arrow_bullet', '/assets/bullets/arrow.png');
    this.load.image('cannon_bullet', '/assets/bullets/bullet.png');
    this.load.image('cannon_bullet_fire', '/assets/bullets/bullet_fire.png');
  }

  create(): void {
    this.scene.start('GameScene');
  }
}
