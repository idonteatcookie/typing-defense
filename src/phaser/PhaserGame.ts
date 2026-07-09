import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { GAME_WIDTH, GAME_HEIGHT } from '@/constants/gameConstants';

export function createPhaserGame(container: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: container,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    transparent: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, GameScene],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
  };

  return new Phaser.Game(config);
}
