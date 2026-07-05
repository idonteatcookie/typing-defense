import type { WaveConfig, MonsterSpawn } from '../types/level';
import type { MonsterType } from '../types/game';

export class WaveManager {
  private waves: WaveConfig[] = [];
  private currentWaveIndex: number = 0;
  private spawnTimer: number = 0;
  private waveDelayTimer: number = 0;
  private isWaveActive: boolean = false;
  private isBetweenWaves: boolean = true;
  private spawnQueue: { type: MonsterType; spawned: number; total: number; interval: number; timer: number }[] = [];
  private allSpawned: boolean = false;
  private isEndless: boolean = false;
  private loopCount: number = 0;

  constructor() {}

  startWaves(waves: WaveConfig[], isEndless: boolean = false): void {
    this.waves = waves;
    this.currentWaveIndex = 0;
    this.isWaveActive = false;
    this.isBetweenWaves = false;
    this.waveDelayTimer = 0;
    this.spawnQueue = [];
    this.allSpawned = false;
    this.isEndless = isEndless;
    this.loopCount = 0;
    this.startCurrentWave();
  }

  private onWaveStartCallback?: () => void;

  setOnWaveStart(callback: () => void): void {
    this.onWaveStartCallback = callback;
  }

  update(deltaTime: number): { type: MonsterType }[] {
    const spawnedMonsters: { type: MonsterType }[] = [];

    if (this.isBetweenWaves) {
      this.waveDelayTimer -= deltaTime;
      if (this.waveDelayTimer <= 0) {
        this.startCurrentWave();
        // 下一波真正开始时触发回调
        if (this.onWaveStartCallback) {
          this.onWaveStartCallback();
        }
      }
      return spawnedMonsters;
    }

    if (!this.isWaveActive) return spawnedMonsters;

    let allDone = true;

    for (const spawn of this.spawnQueue) {
      if (spawn.spawned >= spawn.total) continue;

      allDone = false;
      spawn.timer -= deltaTime;

      if (spawn.timer <= 0) {
        spawnedMonsters.push({ type: spawn.type });
        spawn.spawned++;
        spawn.timer = spawn.interval / 1000;
      }
    }

    if (allDone) {
      this.allSpawned = true;
    }

    return spawnedMonsters;
  }

  private startCurrentWave(): void {
    if (this.currentWaveIndex >= this.waves.length) {
      if (this.isEndless) {
        this.currentWaveIndex = 0;
        this.loopCount++;
      } else {
        this.isWaveActive = false;
        return;
      }
    }

    const wave = this.waves[this.currentWaveIndex];
    this.spawnQueue = wave.monsters.map((m: MonsterSpawn) => ({
      type: m.type as MonsterType,
      spawned: 0,
      total: m.count,
      interval: m.interval,
      timer: 0,
    }));

    this.isWaveActive = true;
    this.isBetweenWaves = false;
    this.allSpawned = false;
  }

  startNextWave(): boolean {
    this.currentWaveIndex++;
    if (this.currentWaveIndex >= this.waves.length) {
      if (this.isEndless) {
        this.currentWaveIndex = 0;
        this.loopCount++;
      } else {
        return false;
      }
    }

    const wave = this.waves[this.currentWaveIndex];
    this.isBetweenWaves = true;
    this.waveDelayTimer = (wave.delay || 3000) / 1000;
    this.isWaveActive = false;
    this.allSpawned = false;
    return true;
  }

  isCurrentWaveComplete(): boolean {
    return this.allSpawned;
  }

  isAllWavesComplete(): boolean {
    if (this.isEndless) return false;
    return this.currentWaveIndex >= this.waves.length - 1 && this.allSpawned;
  }

  getCurrentWaveNumber(): number {
    return this.currentWaveIndex + 1;
  }

  getTotalWaves(): number {
    return this.waves.length;
  }

  getLoopCount(): number {
    return this.loopCount;
  }

  getWaveDelayRemaining(): number {
    return this.isBetweenWaves ? this.waveDelayTimer : 0;
  }

  isWaiting(): boolean {
    return this.isBetweenWaves;
  }

  getTotalMonsterCount(): number {
    let total = 0;
    for (const wave of this.waves) {
      for (const spawn of wave.monsters) {
        total += spawn.count;
      }
    }
    return total;
  }
}
