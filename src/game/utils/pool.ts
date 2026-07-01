export interface Poolable {
  reset(): void;
  active: boolean;
}

export class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private factory: () => T;
  private maxSize: number;

  constructor(factory: () => T, initialSize: number = 20, maxSize: number = 100) {
    this.factory = factory;
    this.maxSize = maxSize;

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  acquire(): T {
    const obj = this.pool.find(o => !o.active);
    if (obj) {
      obj.active = true;
      return obj;
    }

    if (this.pool.length < this.maxSize) {
      const newObj = this.factory();
      newObj.active = true;
      this.pool.push(newObj);
      return newObj;
    }

    const oldest = this.pool[0];
    oldest.reset();
    oldest.active = true;
    return oldest;
  }

  release(obj: T): void {
    obj.active = false;
    obj.reset();
  }

  releaseAll(): void {
    this.pool.forEach(obj => {
      obj.active = false;
      obj.reset();
    });
  }

  getActiveCount(): number {
    return this.pool.filter(o => o.active).length;
  }

  getAllActive(): T[] {
    return this.pool.filter(o => o.active);
  }

  getAll(): T[] {
    return this.pool;
  }

  clear(): void {
    this.pool = [];
  }
}
