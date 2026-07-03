import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GRID_SIZE } from '@/constants/gameConstants';
import { gameManager } from '@/game/GameManager';
import { eventBus } from '@/game/EventBus';
import { EVENT_NAMES } from '@/constants/eventNames';
import { useGameStore } from '@/store/useGameStore';
import { worldToGrid } from '@/game/utils/grid';

function hexToNumber(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

export class GameScene extends Phaser.Scene {
  private pathGraphics!: Phaser.GameObjects.Graphics;
  private gridGraphics!: Phaser.GameObjects.Graphics;
  private monsters: Map<string, Phaser.GameObjects.Container> = new Map();
  private towers: Map<string, Phaser.GameObjects.Container> = new Map();
  private bullets: Map<string, Phaser.GameObjects.Arc> = new Map();
  private cannon!: Phaser.GameObjects.Container;
  private hoverCell: { x: number; y: number } | null = null;
  private rangeCircle!: Phaser.GameObjects.Arc;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.createBackground();
    this.createPath();
    this.createGrid();
    this.createCannon();
    this.setupEventListeners();
    this.setupInputListeners();
    this.setupPlacingTowerListener();
  }

  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillStyle(0x4a8c4a, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    for (let x = 0; x < GAME_WIDTH; x += 40) {
      for (let y = 0; y < GAME_HEIGHT; y += 40) {
        const shade = Math.random() * 0.12;
        const isLighter = Math.random() > 0.5;
        bg.fillStyle(isLighter ? 0x5a9c5a : 0x3d7c3d, shade);
        bg.fillRect(x, y, 40, 40);
      }
    }

    const border = this.add.graphics();
    border.lineStyle(6, 0x2d5a2d, 1);
    border.strokeRect(3, 3, GAME_WIDTH - 6, GAME_HEIGHT - 6);
    border.lineStyle(2, 0x6bb06b, 1);
    border.strokeRect(3, 3, GAME_WIDTH - 6, GAME_HEIGHT - 6);
  }

  private createPath(): void {
    this.pathGraphics = this.add.graphics();
    this.drawPath();
  }

  private drawPath(): void {
    const path = gameManager.getPath();
    if (path.length < 2) return;

    this.pathGraphics.clear();

    this.pathGraphics.lineStyle(GRID_SIZE * 0.85, 0x8b5a2b, 1);
    this.pathGraphics.strokePoints(
      path.map(p => new Phaser.Geom.Point(p.x, p.y))
    );

    this.pathGraphics.lineStyle(GRID_SIZE * 0.7, 0xdaa520, 1);
    this.pathGraphics.strokePoints(
      path.map(p => new Phaser.Geom.Point(p.x, p.y))
    );

    this.pathGraphics.lineStyle(GRID_SIZE * 0.5, 0xffd700, 1);
    this.pathGraphics.strokePoints(
      path.map(p => new Phaser.Geom.Point(p.x, p.y))
    );

    const startPoint = path[0];
    const endPoint = path[path.length - 1];

    this.pathGraphics.fillStyle(0xa855f7, 0.15);
    this.pathGraphics.fillCircle(startPoint.x, startPoint.y, 40);

    this.pathGraphics.fillStyle(0xc084fc, 1);
    this.pathGraphics.fillCircle(startPoint.x, startPoint.y, 30);

    this.pathGraphics.lineStyle(4, 0x7c3aed, 1);
    this.pathGraphics.strokeCircle(startPoint.x, startPoint.y, 30);

    this.pathGraphics.fillStyle(0x7c3aed, 0.8);
    this.pathGraphics.fillCircle(startPoint.x, startPoint.y, 18);

    this.pathGraphics.fillStyle(0xef4444, 0.15);
    this.pathGraphics.fillCircle(endPoint.x, endPoint.y, 40);

    this.pathGraphics.fillStyle(0xf87171, 1);
    this.pathGraphics.fillCircle(endPoint.x, endPoint.y, 30);

    this.pathGraphics.lineStyle(4, 0xdc2626, 1);
    this.pathGraphics.strokeCircle(endPoint.x, endPoint.y, 30);

    this.pathGraphics.fillStyle(0xdc2626, 0.8);
    this.pathGraphics.fillCircle(endPoint.x, endPoint.y, 18);
  }

  private createGrid(): void {
    this.gridGraphics = this.add.graphics();
    this.gridGraphics.setDepth(100);
    this.gridGraphics.setVisible(false);

    this.rangeCircle = this.add.circle(0, 0, 0, 0x000000, 0.1);
    this.rangeCircle.setStrokeStyle(2, 0xffffff, 0.5);
    this.rangeCircle.setDepth(101);
    this.rangeCircle.setVisible(false);
  }

  private createCannon(): void {
    const pos = gameManager.getCannonPosition();
    this.cannon = this.add.container(pos.x, pos.y);

    const shadow = this.add.circle(3, 5, 32, 0x000000, 0.3);

    const baseOuter = this.add.circle(0, 2, 32, 0x64748b);
    baseOuter.setStrokeStyle(4, 0x334155);

    const baseInner = this.add.circle(0, 0, 26, 0x475569);
    baseInner.setStrokeStyle(2, 0x1e293b);

    const barrelBase = this.add.rectangle(0, -5, 16, 18, 0x64748b);
    barrelBase.setStrokeStyle(2, 0x334155);
    barrelBase.setOrigin(0.5, 1);

    const barrel = this.add.rectangle(0, -18, 10, 28, 0x94a3b8);
    barrel.setStrokeStyle(2, 0x64748b);
    barrel.setOrigin(0.5, 1);

    const muzzle = this.add.rectangle(0, -32, 14, 8, 0x475569);
    muzzle.setStrokeStyle(2, 0x1e293b);

    const centerGem = this.add.circle(0, 0, 8, 0x22c55e);
    centerGem.setStrokeStyle(2, 0x15803d);

    this.cannon.add([shadow, baseOuter, baseInner, barrelBase, barrel, muzzle, centerGem]);
    this.cannon.setDepth(50);
  }

  private setupEventListeners(): void {
    eventBus.on(EVENT_NAMES.GAME_START, () => {
      this.resetScene();
    });

    eventBus.on(EVENT_NAMES.MONSTER_SPAWN, (monster) => {
      this.addMonster(monster.id, monster.x, monster.y, hexToNumber(monster.color), monster.size, monster.type);
    });

    eventBus.on(EVENT_NAMES.MONSTER_DEATH, (monster) => {
      this.removeMonster(monster.id);
      this.showDeathEffect(monster.x, monster.y);
    });

    eventBus.on(EVENT_NAMES.MONSTER_HIT, (data) => {
      this.showHitEffect(data.monster.x, data.monster.y);
    });

    eventBus.on(EVENT_NAMES.MONSTER_REACH_END, (monster) => {
      this.removeMonster(monster.id);
    });

    eventBus.on(EVENT_NAMES.TOWER_PLACE, (tower) => {
      this.addTower(tower.id, tower.x, tower.y, tower.type, hexToNumber(tower.color));
      this.showPlaceEffect(tower.x, tower.y);
    });

    eventBus.on(EVENT_NAMES.TOWER_SELL, (tower) => {
      this.removeTower(tower.id);
    });

    eventBus.on(EVENT_NAMES.BULLET_FIRE, (bullet) => {
      this.addBullet(bullet.id, bullet.x, bullet.y, hexToNumber(bullet.color), bullet.towerType);
      const cannonPos = gameManager.getCannonPosition();
      this.showMuzzleFlash(cannonPos.x, cannonPos.y, hexToNumber(bullet.color));
    });

    eventBus.on(EVENT_NAMES.BULLET_HIT, (data) => {
      data.monsterIds.forEach(id => {
        const monster = this.monsters.get(id);
        if (monster) {
          this.tweens.add({
            targets: monster,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 100,
            yoyo: true,
          });
        }
      });
    });

    eventBus.on(EVENT_NAMES.GAME_VICTORY, () => {
      this.cameras.main.flash(500, 255, 255, 200);
    });

    eventBus.on(EVENT_NAMES.GAME_DEFEAT, () => {
      this.cameras.main.shake(300, 0.01);
      this.cameras.main.flash(500, 200, 50, 50);
    });
  }

  private setupInputListeners(): void {
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      const placingTowerType = useGameStore.getState().placingTowerType;
      if (!placingTowerType) {
        this.gridGraphics.setVisible(false);
        this.rangeCircle.setVisible(false);
        return;
      }

      this.gridGraphics.setVisible(true);
      const grid = worldToGrid(pointer.x, pointer.y);
      this.hoverCell = grid;

      this.updateGridDisplay(grid.x, grid.y, placingTowerType);
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const state = useGameStore.getState();
      const placingTowerType = state.placingTowerType;

      if (placingTowerType) {
        const grid = worldToGrid(pointer.x, pointer.y);
        const canPlace = gameManager.towerSystem.canPlaceAt(grid.x, grid.y);

        if (canPlace) {
          const success = gameManager.placeTower(placingTowerType, grid.x, grid.y);
          if (success) {
            useGameStore.getState().cancelPlacingTower();
          }
        }
      }
    });

    this.input.keyboard?.on('keydown-ESC', () => {
      useGameStore.getState().cancelPlacingTower();
    });
  }

  private setupPlacingTowerListener(): void {
    let prevPlacing: string | null = null;
    useGameStore.subscribe((state) => {
      const current = state.placingTowerType;
      if (current !== prevPlacing) {
        prevPlacing = current;
        if (current) {
          this.gridGraphics.setVisible(true);
          this.drawFullGrid();
        } else {
          this.gridGraphics.setVisible(false);
          this.rangeCircle.setVisible(false);
        }
      }
    });
  }

  private drawFullGrid(): void {
    this.gridGraphics.clear();
    for (let x = 0; x < Math.ceil(GAME_WIDTH / GRID_SIZE); x++) {
      for (let y = 0; y < Math.ceil(GAME_HEIGHT / GRID_SIZE); y++) {
        this.gridGraphics.lineStyle(1, 0xffffff, 0.12);
        this.gridGraphics.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      }
    }
  }

  private updateGridDisplay(gridX: number, gridY: number, towerType: string): void {
    this.gridGraphics.clear();

    for (let x = 0; x < Math.ceil(GAME_WIDTH / GRID_SIZE); x++) {
      for (let y = 0; y < Math.ceil(GAME_HEIGHT / GRID_SIZE); y++) {
        const canPlace = gameManager.towerSystem.canPlaceAt(x, y);
        const isHover = x === gridX && y === gridY;

        if (isHover) {
          if (canPlace) {
            this.gridGraphics.fillStyle(0x22c55e, 0.3);
            this.gridGraphics.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
          } else {
            this.gridGraphics.fillStyle(0xef4444, 0.3);
            this.gridGraphics.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
          }
        } else {
          this.gridGraphics.lineStyle(1, 0xffffff, 0.1);
          this.gridGraphics.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
      }
    }

    const canPlace = gameManager.towerSystem.canPlaceAt(gridX, gridY);
    if (canPlace) {
      const config = gameManager.towerSystem.getTowerConfig(towerType as any);
      const centerX = gridX * GRID_SIZE + GRID_SIZE / 2;
      const centerY = gridY * GRID_SIZE + GRID_SIZE / 2;

      this.rangeCircle.setVisible(true);
      this.rangeCircle.setPosition(centerX, centerY);
      this.rangeCircle.setRadius(config.range);
      this.rangeCircle.setFillStyle(0x22c55e, 0.1);
      this.rangeCircle.setStrokeStyle(2, 0x22c55e, 0.5);
    } else {
      this.rangeCircle.setVisible(false);
    }
  }

  private addMonster(id: string, x: number, y: number, color: number, size: number, type?: string): void {
    const container = this.add.container(x, y);

    let body: Phaser.GameObjects.Image | Phaser.GameObjects.Arc;
    if (type && this.textures.exists(type)) {
      body = this.add.image(0, 0, type);
      const scale = (size * 2) / Math.max(body.width, body.height);
      body.setScale(scale);
    } else {
      body = this.add.circle(0, 0, size, color);
      body.setStrokeStyle(3, 0x000000, 0.6);
      const highlight = this.add.circle(-size * 0.3, -size * 0.3, size * 0.3, 0xffffff, 0.3);
      const eye1 = this.add.circle(-size * 0.3, -size * 0.1, size * 0.22, 0xffffff);
      const eye2 = this.add.circle(size * 0.3, -size * 0.1, size * 0.22, 0xffffff);
      const pupil1 = this.add.circle(-size * 0.3, -size * 0.05, size * 0.1, 0x000000);
      const pupil2 = this.add.circle(size * 0.3, -size * 0.05, size * 0.1, 0x000000);
      container.add([highlight, eye1, eye2, pupil1, pupil2]);
    }

    const hpBarBg = this.add.rectangle(0, -size - 12, size * 2.2, 7, 0x1a1a1a, 0.8);
    hpBarBg.setStrokeStyle(1, 0x444444, 0.8);
    const hpBar = this.add.rectangle(-size * 1.1, -size - 12, size * 2.2, 7, 0x22c55e);
    hpBar.setOrigin(0, 0.5);

    container.add([body, hpBarBg, hpBar]);
    container.setData('hpBar', hpBar);
    container.setData('maxHp', 100);
    container.setData('size', size);
    container.setDepth(10);

    this.monsters.set(id, container);

    this.tweens.add({
      targets: container,
      scale: { from: 0, to: 1 },
      duration: 200,
      ease: 'Back.out',
    });
  }

  private removeMonster(id: string): void {
    const monster = this.monsters.get(id);
    if (monster) {
      this.tweens.add({
        targets: monster,
        scale: 0,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          monster.destroy();
          this.monsters.delete(id);
        },
      });
    }
  }

  private addTower(id: string, x: number, y: number, type: string, color: number): void {
    const container = this.add.container(x, y);

    const shadow = this.add.circle(2, 8, 20, 0x000000, 0.3);

    if (this.textures.exists('tower')) {
      const tower = this.add.image(0, 0, 'tower');
      const scale = 40 / Math.max(tower.width, tower.height);
      tower.setScale(scale);
      container.add([shadow, tower]);
    } else {
      const base = this.add.circle(0, 6, 20, 0x64748b);
      base.setStrokeStyle(3, 0x334155);

      const platform = this.add.circle(0, 2, 16, 0x475569);
      platform.setStrokeStyle(2, 0x1e293b);

      const body = this.add.rectangle(0, -8, 22, 22, color);
      body.setStrokeStyle(2, 0x000000, 0.4);

      const top = this.add.circle(0, -18, 11, color);
      top.setStrokeStyle(2, 0x000000, 0.4);

      const gem = this.add.circle(0, -18, 5, 0xffffff, 0.5);

      container.add([shadow, base, platform, body, top, gem]);
    }

    container.setDepth(20);
    this.towers.set(id, container);

    this.tweens.add({
      targets: container,
      scaleY: { from: 0, to: 1 },
      scaleX: { from: 0.5, to: 1 },
      duration: 300,
      ease: 'Back.out',
    });
  }

  private removeTower(id: string): void {
    const tower = this.towers.get(id);
    if (tower) {
      this.tweens.add({
        targets: tower,
        scale: 0,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          tower.destroy();
          this.towers.delete(id);
        },
      });
    }
  }

  private addBullet(id: string, x: number, y: number, color: number, towerType?: string): void {
    const container = this.add.container(x, y);

    let bulletImage: string | null = null;
    let isFrenzy = false;

    if (towerType === 'cannon') {
      const combo = gameManager.typingManager.getCombo();
      isFrenzy = combo >= 10;
      if (isFrenzy && this.textures.exists('cannon_bullet_fire')) {
        bulletImage = 'cannon_bullet_fire';
      } else if (this.textures.exists('cannon_bullet')) {
        bulletImage = 'cannon_bullet';
      }
    } else if (towerType === 'arrow' && this.textures.exists('arrow_bullet')) {
      bulletImage = 'arrow_bullet';
    }

    if (bulletImage) {
      const sprite = this.add.image(0, 0, bulletImage);
      const baseSize = towerType === 'cannon' && isFrenzy ? 30 : 20;
      const scale = baseSize / Math.max(sprite.width, sprite.height);
      sprite.setScale(scale);
      container.add([sprite]);
    } else {
      const glow = this.add.circle(0, 0, 10, color, 0.3);
      glow.setData('isGlow', true);

      const bullet = this.add.circle(0, 0, 6, color);
      bullet.setStrokeStyle(2, 0xffffff, 0.7);

      const highlight = this.add.circle(-2, -2, 2, 0xffffff, 0.8);
      highlight.setData('isHighlight', true);

      container.add([glow, bullet, highlight]);
    }

    container.setDepth(30);

    this.bullets.set(id, container as any);
  }

  private showMuzzleFlash(x: number, y: number, color: number): void {
    const flash = this.add.circle(x, y, 15, color, 0.9);
    flash.setDepth(45);

    const flashOuter = this.add.circle(x, y, 25, color, 0.4);
    flashOuter.setDepth(44);

    this.tweens.add({
      targets: [flash, flashOuter],
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 1, to: 0 },
      duration: 150,
      ease: 'Cubic.out',
      onComplete: () => {
        flash.destroy();
        flashOuter.destroy();
      },
    });
  }

  private showHitEffect(x: number, y: number): void {
    const effect = this.add.circle(x, y, 20, 0xffffff, 0.8);
    effect.setDepth(60);

    this.tweens.add({
      targets: effect,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 0.8, to: 0 },
      duration: 200,
      onComplete: () => effect.destroy(),
    });
  }

  private showDeathEffect(x: number, y: number): void {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const particle = this.add.circle(x, y, 5, 0xffffff, 0.8);
      particle.setDepth(60);

      const dist = 30 + Math.random() * 20;
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0,
        duration: 400,
        ease: 'Cubic.out',
        onComplete: () => particle.destroy(),
      });
    }
  }

  private showPlaceEffect(x: number, y: number): void {
    const ring = this.add.circle(x, y, 30, 0x22c55e, 0);
    ring.setStrokeStyle(3, 0x22c55e, 0.8);
    ring.setDepth(60);

    this.tweens.add({
      targets: ring,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 0.8, to: 0 },
      duration: 300,
      onComplete: () => ring.destroy(),
    });
  }

  update(time: number, delta: number): void {
    const deltaSeconds = delta / 1000;

    if (gameManager.getState() === 'playing') {
      gameManager.update(deltaSeconds);
      this.updateMonsterDisplay();
      this.updateBulletDisplay();
      this.updateCannonRotation();
      this.updateTowerDisplay();
    }
  }

  private updateMonsterDisplay(): void {
    const monsters = gameManager.monsterSystem.getMonsters();

    for (const monster of monsters) {
      const display = this.monsters.get(monster.id);
      if (display) {
        display.x = monster.x;
        display.y = monster.y;

        const hpBar = display.getData('hpBar') as Phaser.GameObjects.Rectangle;
        const size = display.getData('size') as number;
        if (hpBar && size) {
          const hpPercent = monster.currentHp / monster.maxHp;
          hpBar.width = size * 2.2 * hpPercent;

          if (hpPercent > 0.5) {
            hpBar.setFillStyle(0x22c55e);
          } else if (hpPercent > 0.25) {
            hpBar.setFillStyle(0xeab308);
          } else {
            hpBar.setFillStyle(0xef4444);
          }
        }
      }
    }

    for (const [id, display] of this.monsters) {
      const monster = gameManager.monsterSystem.getMonsterById(id);
      if (!monster && display.active) {
        this.removeMonster(id);
      }
    }
  }

  private updateBulletDisplay(): void {
    const bullets = gameManager.bulletSystem.getBullets();

    for (const bullet of bullets) {
      const display = this.bullets.get(bullet.id);
      if (display) {
        display.x = bullet.x;
        display.y = bullet.y;
      }
    }

    for (const [id, display] of this.bullets) {
      const bullet = gameManager.bulletSystem.getBullets().find(b => b.id === id);
      if (!bullet && display.active) {
        display.destroy();
        this.bullets.delete(id);
      }
    }
  }

  private updateCannonRotation(): void {
    const frontMonster = gameManager.monsterSystem.getFrontMonster();
    if (frontMonster && this.cannon) {
      const pos = gameManager.getCannonPosition();
      const angle = Phaser.Math.Angle.Between(
        pos.x, pos.y,
        frontMonster.x, frontMonster.y
      );
      this.cannon.angle = Phaser.Math.RadToDeg(angle) + 90;
    }
  }

  private updateTowerDisplay(): void {
    const towers = gameManager.towerSystem.getTowers();
    for (const tower of towers) {
      const display = this.towers.get(tower.id);
      if (display) {
        if (tower.attackCooldown < 0.1) {
          display.setScale(1.1);
          this.tweens.add({
            targets: display,
            scale: 1,
            duration: 100,
          });
        }
      }
    }
  }

  clearGame(): void {
    this.monsters.forEach((m) => m.destroy());
    this.towers.forEach((t) => t.destroy());
    this.bullets.forEach((b) => b.destroy());
    this.monsters.clear();
    this.towers.clear();
    this.bullets.clear();
  }

  private resetScene(): void {
    this.clearGame();

    this.drawPath();

    const pos = gameManager.getCannonPosition();
    if (this.cannon) {
      this.cannon.x = pos.x;
      this.cannon.y = pos.y;
    }
  }
}
