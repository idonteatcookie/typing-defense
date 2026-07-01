import { GRID_SIZE } from '@/constants/gameConstants';
import type { Point } from '../types/game';

export function worldToGrid(x: number, y: number): Point {
  return {
    x: Math.floor(x / GRID_SIZE),
    y: Math.floor(y / GRID_SIZE),
  };
}

export function gridToWorld(gridX: number, gridY: number): Point {
  return {
    x: gridX * GRID_SIZE + GRID_SIZE / 2,
    y: gridY * GRID_SIZE + GRID_SIZE / 2,
  };
}

export function gridKey(gridX: number, gridY: number): string {
  return `${gridX},${gridY}`;
}

export function isOnPath(
  gridX: number,
  gridY: number,
  path: Point[],
  pathWidth: number = 1
): boolean {
  const cellCenter = gridToWorld(gridX, gridY);
  const halfCell = GRID_SIZE / 2;
  const pathRadius = (pathWidth * GRID_SIZE) / 2 + halfCell * 0.5;

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];

    const dist = distanceToSegment(
      cellCenter.x, cellCenter.y,
      p1.x, p1.y,
      p2.x, p2.y
    );

    if (dist < pathRadius) {
      return true;
    }
  }

  return false;
}

function distanceToSegment(
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  }

  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const projX = x1 + t * dx;
  const projY = y1 + t * dy;

  return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
}
