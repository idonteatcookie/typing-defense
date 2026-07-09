import { MonsterSystem } from './systems/MonsterSystem';
import { TowerSystem } from './systems/TowerSystem';
import { BulletSystem } from './systems/BulletSystem';
import { TypingManager } from './typing/TypingManager';
import { LevelManager } from './level/LevelManager';
import { WaveManager } from './level/WaveManager';
import { eventBus } from './EventBus';
import { EVENT_NAMES } from '@/constants/eventNames';
import { GAME_WIDTH, GAME_HEIGHT, CANNON_DAMAGE, CANNON_BULLET_SPEED } from '@/constants/gameConstants';
import type { TowerType, GameState, TypingEngineType, EndlessMode } from './types/game';
import type { TypingStats } from './types/typing';
import type { Tower } from './entities/Tower';
import type { Monster } from './entities/Monster';
import type { VictoryData, DefeatData } from './EventBus';
import { getTowerConfig } from './config/TowerConfig';

export class GameManager {
  private static instance: GameManager | null = null;

  public monsterSystem: MonsterSystem;
  public towerSystem: TowerSystem;
  public bulletSystem: BulletSystem;
  public typingManager: TypingManager;
  public levelManager: LevelManager;
  public waveManager: WaveManager;

  private gameState: GameState = 'idle';
  private gold: number = 100;
  private lives: number = 10;
  private score: number = 0;
  private kills: number = 0;
  private currentLevelId: number = 1;
  private startTime: number = 0;
  private cannonPosition = { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 30 };
  private targetAssignDelay: number = 0;
  private isDanger: boolean = false;
  private dangerThreshold: number = 0.8;

  private constructor() {
    this.monsterSystem = new MonsterSystem();
    this.towerSystem = new TowerSystem();
    this.bulletSystem = new BulletSystem();
    this.typingManager = new TypingManager('qwerty');
    this.levelManager = new LevelManager();
    this.waveManager = new WaveManager();
    this.waveManager.setOnWaveStart(() => {
      eventBus.emit(EVENT_NAMES.WAVE_START, this.waveManager.getCurrentWaveNumber());
    });
  }

  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  init(): void {
    this.gameState = 'idle';
  }

  startLevel(levelId: number): void {
    const level = this.levelManager.loadLevel(levelId);
    this.currentLevelId = levelId;

    // 闯关模式始终使用 qwerty 引擎（避免从无尽单词模式切回时遗留 word 引擎）
    if (!level.isEndless && this.typingManager.getCurrentEngineType() !== 'qwerty') {
      this.typingManager.switchEngine('qwerty');
    }

    this.gold = level.startGold;
    this.lives = level.startLives;
    this.score = 0;
    this.kills = 0;
    this.startTime = Date.now();
    eventBus.emit(EVENT_NAMES.KILLS_CHANGE, { current: this.kills });

    const path = level.path;
    this.monsterSystem.setPath(path);
    this.towerSystem.setPath(path);

    this.monsterSystem.clear();
    this.towerSystem.clear();
    this.bulletSystem.clear();
    this.typingManager.reset();
    this.targetAssignDelay = 0;

    this.waveManager.startWaves(level.waves, level.isEndless || false);

    this.gameState = 'playing';
    eventBus.emit(EVENT_NAMES.GAME_START, undefined as any);
    eventBus.emit(EVENT_NAMES.GOLD_CHANGE, { current: this.gold, delta: 0 });
    eventBus.emit(EVENT_NAMES.LIFE_CHANGE, { current: this.lives, delta: 0 });
    eventBus.emit(EVENT_NAMES.WAVE_START, this.waveManager.getCurrentWaveNumber());

    this.assignNewTypingTarget();
  }

  startEndlessMode(mode: EndlessMode): void {
    // 切换打字引擎：字母模式用 qwerty，单词模式用 word
    const engineType: TypingEngineType = mode === 'word' ? 'word' : 'qwerty';
    this.typingManager.switchEngine(engineType);
    this.startLevel(53);
  }

  pause(): void {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
      eventBus.emit(EVENT_NAMES.GAME_PAUSE, undefined as any);
    }
  }

  resume(): void {
    if (this.gameState === 'paused') {
      this.gameState = 'playing';
      eventBus.emit(EVENT_NAMES.GAME_RESUME, undefined as any);
    }
  }

  restart(): void {
    this.startLevel(this.currentLevelId);
  }

  update(deltaTime: number): void {
    if (this.gameState !== 'playing') return;

    const spawnResult = this.waveManager.update(deltaTime);
    for (const spawn of spawnResult) {
      this.monsterSystem.spawnMonster(spawn.type);
    }

    const monsterResult = this.monsterSystem.update(deltaTime);

    for (const monster of monsterResult.reachedEnd) {
      this.loseLife(1);
      this.triggerDefeat();
      return;
    }

    for (const monster of monsterResult.died) {
      this.addGold(monster.goldReward);
      this.kills++;
      this.score += monster.goldReward * 10;
      eventBus.emit(EVENT_NAMES.KILLS_CHANGE, { current: this.kills });
    }

    const monsters = this.monsterSystem.getMonsters();
    const towerResult = this.towerSystem.update(deltaTime, monsters);

    for (const attack of towerResult.attacks) {
      const tower = attack.tower;
      for (const target of attack.targets) {
        const config = getTowerConfig(tower.type);
        this.bulletSystem.fireBullet(
          tower.x,
          tower.y,
          target.id,
          target.x,
          target.y,
          tower.damage,
          300,
          tower.type
        );
      }
    }

    const bulletResult = this.bulletSystem.update(deltaTime, monsters);
    for (const hit of bulletResult.hits) {
      for (const monsterId of hit.hitMonsterIds) {
        const result = this.monsterSystem.damageMonster(monsterId, hit.bullet.damage);
        if (result.died && result.monster) {
          this.addGold(result.monster.goldReward);
          this.kills++;
          this.score += result.monster.goldReward * 10;
          eventBus.emit(EVENT_NAMES.KILLS_CHANGE, { current: this.kills });
        }
      }
    }

    this.checkWaveComplete();
    this.checkTypingTarget(deltaTime);
    this.checkDanger();
    this.checkDefeat();
    this.checkVictory();
  }

  private checkDanger(): void {
    const frontMonster = this.monsterSystem.getFrontMonster();
    const path = this.levelManager.getPath();
    if (!frontMonster || path.length < 2) {
      if (this.isDanger) {
        this.isDanger = false;
        eventBus.emit(EVENT_NAMES.MONSTER_NEAR_END, false);
      }
      return;
    }

    let totalPathLength = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const dx = path[i + 1].x - path[i].x;
      const dy = path[i + 1].y - path[i].y;
      totalPathLength += Math.sqrt(dx * dx + dy * dy);
    }

    const progress = frontMonster.getProgress();
    const progressRatio = progress / totalPathLength;
    const isNearEnd = progressRatio >= this.dangerThreshold;

    if (isNearEnd !== this.isDanger) {
      this.isDanger = isNearEnd;
      eventBus.emit(EVENT_NAMES.MONSTER_NEAR_END, isNearEnd);
    }
  }

  private checkWaveComplete(): void {
    if (this.waveManager.isCurrentWaveComplete() &&
        this.monsterSystem.getActiveCount() === 0) {
      const currentWave = this.waveManager.getCurrentWaveNumber();
      eventBus.emit(EVENT_NAMES.WAVE_COMPLETE, currentWave);

      if (!this.waveManager.isAllWavesComplete()) {
        this.waveManager.startNextWave();
        // WAVE_START 事件会在 waveDelayTimer 结束后由回调触发
      }
    }
  }

  private checkTypingTarget(deltaTime: number): void {
    if (this.targetAssignDelay > 0) {
      this.targetAssignDelay -= deltaTime;
      if (this.targetAssignDelay <= 0) {
        this.assignNewTypingTarget();
      }
    }
  }

  private assignNewTypingTarget(): void {
    const difficulty = this.levelManager.getTypingDifficulty();
    const practiceLetters = this.levelManager.getPracticeLetters();
    this.typingManager.newTarget(difficulty, this.currentLevelId, practiceLetters);
  }

  handleTypingInput(char: string): void {
    if (this.gameState !== 'playing') return;

    const result = this.typingManager.handleInput(char);

    if (result.complete) {
      this.fireCannon();
    }
  }

  private fireCannon(): void {
    const frontMonster = this.monsterSystem.getFrontMonster();

    if (frontMonster) {
      const multiplier = this.typingManager.getComboDamageMultiplier();
      const damage = Math.floor(CANNON_DAMAGE * multiplier);

      this.bulletSystem.fireBullet(
        this.cannonPosition.x,
        this.cannonPosition.y,
        frontMonster.id,
        frontMonster.x,
        frontMonster.y,
        damage,
        CANNON_BULLET_SPEED,
        'cannon'
      );

      eventBus.emit(EVENT_NAMES.CANNON_FIRE, {
        targetId: frontMonster.id,
        damage,
      });
    }

    this.targetAssignDelay = 0.1;
  }

  placeTower(type: TowerType, gridX: number, gridY: number): boolean {
    const config = getTowerConfig(type);
    if (this.gold < config.cost) return false;

    const tower = this.towerSystem.placeTower(type, gridX, gridY);
    if (tower) {
      this.spendGold(config.cost);
      return true;
    }
    return false;
  }

  sellTower(towerId: string): void {
    const refund = this.towerSystem.sellTower(towerId);
    if (refund > 0) {
      this.addGold(refund);
    }
  }

  addGold(amount: number): void {
    this.gold += amount;
    eventBus.emit(EVENT_NAMES.GOLD_CHANGE, { current: this.gold, delta: amount });
  }

  spendGold(amount: number): boolean {
    if (this.gold < amount) return false;
    this.gold -= amount;
    eventBus.emit(EVENT_NAMES.GOLD_CHANGE, { current: this.gold, delta: -amount });
    return true;
  }

  loseLife(amount: number): void {
    this.lives -= amount;
    eventBus.emit(EVENT_NAMES.LIFE_CHANGE, { current: this.lives, delta: -amount });
    if (this.lives <= 0 && this.gameState === 'playing') {
      this.triggerDefeat();
    }
  }

  private triggerDefeat(): void {
    if (this.gameState !== 'playing') return;
    this.gameState = 'defeat';
    const elapsed = (Date.now() - this.startTime) / 1000;

    const defeatData: DefeatData = {
      levelId: this.currentLevelId,
      kills: this.kills,
      waveReached: this.waveManager.getCurrentWaveNumber(),
      stats: this.typingManager.getStats(),
      time: Math.floor(elapsed),
    };

    eventBus.emit(EVENT_NAMES.GAME_DEFEAT, defeatData);
  }

  private checkVictory(): void {
    if (this.levelManager.isEndless()) return;

    const totalMonsters = this.waveManager.getTotalMonsterCount();
    if (this.waveManager.isAllWavesComplete() &&
        this.monsterSystem.getActiveCount() === 0 &&
        this.kills >= totalMonsters &&
        this.gameState === 'playing') {
      this.gameState = 'victory';
      const elapsed = (Date.now() - this.startTime) / 1000;
      const stars = this.calculateStars();

      const victoryData: VictoryData = {
        levelId: this.currentLevelId,
        kills: this.kills,
        goldEarned: this.gold,
        stats: this.typingManager.getStats(),
        stars,
        time: Math.floor(elapsed),
      };

      eventBus.emit(EVENT_NAMES.GAME_VICTORY, victoryData);
    }
  }

  private checkDefeat(): void {
    if (this.lives <= 0 && this.gameState === 'playing') {
      this.triggerDefeat();
    }
  }

  private calculateStars(): number {
    const lifePercent = this.lives / this.levelManager.getStartLives();
    const accuracy = this.typingManager.getStats().accuracy;

    if (lifePercent >= 0.8 && accuracy >= 0.95) return 3;
    if (lifePercent >= 0.5 && accuracy >= 0.8) return 2;
    return 1;
  }

  getState(): GameState {
    return this.gameState;
  }

  getGold(): number {
    return this.gold;
  }

  getLives(): number {
    return this.lives;
  }

  getScore(): number {
    return this.score;
  }

  getKills(): number {
    return this.kills;
  }

  getCurrentLevelId(): number {
    return this.currentLevelId;
  }

  getCannonPosition(): { x: number; y: number } {
    return this.cannonPosition;
  }

  getTypingStats(): TypingStats {
    return this.typingManager.getStats();
  }

  switchTypingEngine(type: TypingEngineType): void {
    this.typingManager.switchEngine(type);
  }

  getPath(): { x: number; y: number }[] {
    return this.levelManager.getPath();
  }

  getAvailableTowers(): TowerType[] {
    return this.levelManager.getAvailableTowers() as TowerType[];
  }

  getCurrentWave(): number {
    return this.waveManager.getCurrentWaveNumber();
  }

  getTotalWaves(): number {
    return this.waveManager.getTotalWaves();
  }

  getCurrentWaveMonsterCount(): number {
    return this.waveManager.getCurrentWaveMonsterCount();
  }

  getTotalMonsterCount(): number {
    return this.waveManager.getTotalMonsterCount();
  }

  getMonsterCountUpToWave(waveNumber: number): number {
    return this.waveManager.getMonsterCountUpToWave(waveNumber - 1);
  }
}

export const gameManager = GameManager.getInstance();
