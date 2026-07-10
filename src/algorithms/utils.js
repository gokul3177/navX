/**
 * MinHeap — Binary min-heap for O(log n) priority queue operations.
 * Used by A* and Dijkstra to efficiently extract the lowest-cost node.
 * @template T
 */
export class MinHeap {
  /** @param {(a: T, b: T) => number} comparator */
  constructor(comparator) {
    this._heap = [];
    this._cmp = comparator;
  }

  get size() { return this._heap.length; }
  get isEmpty() { return this._heap.length === 0; }

  push(item) {
    this._heap.push(item);
    this._bubbleUp(this._heap.length - 1);
  }

  pop() {
    if (this.isEmpty) return undefined;
    const top = this._heap[0];
    const last = this._heap.pop();
    if (this._heap.length > 0) {
      this._heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this._cmp(this._heap[i], this._heap[parent]) < 0) {
        [this._heap[i], this._heap[parent]] = [this._heap[parent], this._heap[i]];
        i = parent;
      } else break;
    }
  }

  _sinkDown(i) {
    const n = this._heap.length;
    while (true) {
      let min = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this._cmp(this._heap[l], this._heap[min]) < 0) min = l;
      if (r < n && this._cmp(this._heap[r], this._heap[min]) < 0) min = r;
      if (min === i) break;
      [this._heap[i], this._heap[min]] = [this._heap[min], this._heap[i]];
      i = min;
    }
  }
}

/** @type {[number,number][]} 4-directional movement */
export const DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

/**
 * Encodes [row, col] to a string key for Set/Map lookups.
 * @param {number} r
 * @param {number} c
 * @returns {string}
 */
export const cellKey = (r, c) => `${r},${c}`;

/**
 * Checks if [r, c] is within the grid.
 * @param {number} r
 * @param {number} c
 * @param {number} gridSize
 * @returns {boolean}
 */
export const inBounds = (r, c, gridSize) =>
  r >= 0 && c >= 0 && r < gridSize && c < gridSize;

/**
 * Builds an obstacle Set<string> from an array of [row, col] pairs.
 * @param {[number,number][]} obstacles
 * @returns {Set<string>}
 */
export function buildObstacleSet(obstacles) {
  return new Set(obstacles.map(([r, c]) => cellKey(r, c)));
}

/**
 * Reconstructs the path from goal back to start using a parent map.
 * @param {Map<string, [number,number]>} parentMap
 * @param {[number,number]} start
 * @param {[number,number]} goal
 * @returns {[number,number][]}
 */
export function reconstructPath(parentMap, start, goal) {
  const path = [];
  let current = goal;

  while (current) {
    path.unshift(current);
    if (current[0] === start[0] && current[1] === start[1]) break;
    current = parentMap.get(cellKey(current[0], current[1])) || null;
  }

  return path;
}
