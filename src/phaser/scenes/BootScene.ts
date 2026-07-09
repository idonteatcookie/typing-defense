import Phaser from 'phaser';
import { asset } from '@/utils/asset';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    progressBox.fillRect(centerX - 160, centerY - 25, 320, 50);

    const loadingText = this.add.text(centerX, centerY - 50, '加载中...', {
      fontSize: '24px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    const percentText = this.add.text(centerX, centerY, '0%', {
      fontSize: '20px',
      color: '#ffffff',
    });
    percentText.setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x22c55e, 1);
      progressBar.fillRect(centerX - 150, centerY - 15, 300 * value, 30);
      percentText.setText(Math.round(value * 100) + '%');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    this.load.image('slime', asset('assets/monsters/slime.png'));
    this.load.image('runner', asset('assets/monsters/runner.png'));
    this.load.image('tank', asset('assets/monsters/tank.png'));
    this.load.image('tower', asset('assets/towers/tower.png'));
    this.load.image('tower_arrow', asset('assets/towers/arrow.png'));
    this.load.image('tower_magic', asset('assets/towers/magic.png'));
    this.load.image('tower_ice', asset('assets/towers/ice.png'));
    this.load.image('tower_sniper', asset('assets/towers/sniper.png'));
    this.load.image('arrow_bullet', asset('assets/bullets/arrow.png'));
    this.load.image('cannon_bullet', asset('assets/bullets/bullet.png'));
    this.load.image('cannon_bullet_fire', asset('assets/bullets/bullet_fire.png'));
    this.load.image('cannon_base', asset('assets/towers/cannon_base.png'));
    this.load.image('cannon_barrel', asset('assets/towers/cannon_barrel.png'));
    this.load.image('slate', asset('assets/ui/slate.png'));
    this.load.image('monstor_home', asset('assets/ui/monstor_home.png'));
    this.load.image('player_home', asset('assets/ui/player_home.png'));
  }

  create(): void {
    this.scene.start('GameScene');
  }
}
