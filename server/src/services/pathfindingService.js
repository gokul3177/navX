/**
 * @file pathfindingService.js
 * @description Pure algorithm implementations for the backend.
 * These mirror the frontend algorithms but run on the server to enable
 * server-side validation of results and future API-only usage.
 *
 * All algorithms return: { path: Array, visited: Array, nodesExplored: number }
 */

/**
 * Encodes a [row, col] pair as a string key for Sets/Maps.
 * @param {number} r - Row
 * @param {number} c - Column
 * @returns {string}
 */
const key = (r, c) => `${r},${c}`;

/**
 * Builds an obstacle Set from an array of [row, col] pairs.
 * @param {Array<[number, number]>} obstacles
 * @returns {Set<string>}
 */
function buildObstacleSet(obstacles) {
  return new Set(obstacles.map(([r, c]) => key(r, c)));
}

/** 4-directional movement: up, right, down, left */
const DIRECTIONS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

/**
 * Checks if a position is within grid bounds.
 */
function inBounds(r, c, gridSize) {
  return r >= 0 && c >= 0 && r < gridSize && c < gridSize;
}

/**
 * Reconstructs the shortest path from a parent map.
 * @param {Map<string, [number, number]>} parentMap
 * @param {[number, number]} start
 * @param {[number, number]} goal
 * @returns {Array<[number, number]>}
 */
function reconstructPath(parentMap, start, goal) {
  const path = [];
  let current = goal;
  while (current) {
    path.unshift(current);
    const k = key(current[0], current[1]);
    current = parentMap.get(k) || null;
    if (current && current[0] === start[0] && current[1] === start[1]) {
      path.unshift(start);
      break;
    }
  }
  return path;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Breadth-First Search — guarantees shortest path on unweighted grids.
 * Time: O(V + E), Space: O(V)
 */
function bfs(start, goal, obstacles, gridSize) {
  const obstacleSet = buildObstacleSet(obstacles);
  const queue = [start];
  const visited = [];
  const parentMap = new Map();
  const seen = new Set([key(start[0], start[1])]);

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    visited.push([r, c]);

    if (r === goal[0] && c === goal[1]) {
      return { visited, path: reconstructPath(parentMap, start, goal), nodesExplored: visited.length };
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = key(nr, nc);
      if (inBounds(nr, nc, gridSize) && !obstacleSet.has(nk) && !seen.has(nk)) {
        seen.add(nk);
        parentMap.set(nk, [r, c]);
        queue.push([nr, nc]);
      }
    }
  }
  return { visited, path: [], nodesExplored: visited.length };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Depth-First Search — explores as far as possible along each branch.
 * Does NOT guarantee shortest path. Time: O(V + E), Space: O(V)
 */
function dfs(start, goal, obstacles, gridSize) {
  const obstacleSet = buildObstacleSet(obstacles);
  const stack = [start];
  const visited = [];
  const parentMap = new Map();
  const seen = new Set([key(start[0], start[1])]);

  while (stack.length > 0) {
    const [r, c] = stack.pop();
    visited.push([r, c]);

    if (r === goal[0] && c === goal[1]) {
      return { visited, path: reconstructPath(parentMap, start, goal), nodesExplored: visited.length };
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = key(nr, nc);
      if (inBounds(nr, nc, gridSize) && !obstacleSet.has(nk) && !seen.has(nk)) {
        seen.add(nk);
        parentMap.set(nk, [r, c]);
        stack.push([nr, nc]);
      }
    }
  }
  return { visited, path: [], nodesExplored: visited.length };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * MinHeap — used by Dijkstra and A* for O(log n) priority queue operations.
 */
class MinHeap {
  constructor(comparator) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  get size() { return this.heap.length; }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.comparator(this.heap[i], this.heap[parent]) < 0) {
        [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
        i = parent;
      } else break;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.comparator(this.heap[l], this.heap[smallest]) < 0) smallest = l;
      if (r < n && this.comparator(this.heap[r], this.heap[smallest]) < 0) smallest = r;
      if (smallest !== i) {
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      } else break;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dijkstra's Algorithm — shortest path on weighted/unweighted grids.
 * Time: O((V + E) log V) with min-heap, Space: O(V)
 */
function dijkstra(start, goal, obstacles, gridSize) {
  const obstacleSet = buildObstacleSet(obstacles);
  const dist = new Map([[key(start[0], start[1]), 0]]);
  const parentMap = new Map();
  const visited = [];
  const finalized = new Set();

  const pq = new MinHeap((a, b) => a.cost - b.cost);
  pq.push({ pos: start, cost: 0 });

  while (pq.size > 0) {
    const { pos: [r, c], cost } = pq.pop();
    const k = key(r, c);

    if (finalized.has(k)) continue;
    finalized.add(k);
    visited.push([r, c]);

    if (r === goal[0] && c === goal[1]) {
      return { visited, path: reconstructPath(parentMap, start, goal), nodesExplored: visited.length };
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = key(nr, nc);
      if (!inBounds(nr, nc, gridSize) || obstacleSet.has(nk) || finalized.has(nk)) continue;

      const newCost = cost + 1;
      if (newCost < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, newCost);
        parentMap.set(nk, [r, c]);
        pq.push({ pos: [nr, nc], cost: newCost });
      }
    }
  }
  return { visited, path: [], nodesExplored: visited.length };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * A* Search — heuristic-guided shortest path. Fastest in practice.
 * Heuristic: Manhattan distance (admissible for 4-directional grids).
 * Time: O((V + E) log V) with min-heap, Space: O(V)
 */
function astar(start, goal, obstacles, gridSize) {
  const obstacleSet = buildObstacleSet(obstacles);
  const h = ([r, c]) => Math.abs(r - goal[0]) + Math.abs(c - goal[1]);

  const gScore = new Map([[key(start[0], start[1]), 0]]);
  const parentMap = new Map();
  const visited = [];
  const closed = new Set();

  const pq = new MinHeap((a, b) => a.f - b.f);
  pq.push({ pos: start, f: h(start), g: 0 });

  while (pq.size > 0) {
    const { pos: [r, c], g } = pq.pop();
    const k = key(r, c);

    if (closed.has(k)) continue;
    closed.add(k);
    visited.push([r, c]);

    if (r === goal[0] && c === goal[1]) {
      return { visited, path: reconstructPath(parentMap, start, goal), nodesExplored: visited.length };
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = key(nr, nc);
      if (!inBounds(nr, nc, gridSize) || obstacleSet.has(nk) || closed.has(nk)) continue;

      const newG = g + 1;
      if (newG < (gScore.get(nk) ?? Infinity)) {
        gScore.set(nk, newG);
        parentMap.set(nk, [r, c]);
        pq.push({ pos: [nr, nc], f: newG + h([nr, nc]), g: newG });
      }
    }
  }
  return { visited, path: [], nodesExplored: visited.length };
}

// ─────────────────────────────────────────────────────────────────────────────

const ALGORITHMS = { BFS: bfs, DFS: dfs, DIJKSTRA: dijkstra, ASTAR: astar };

/**
 * Runs the specified algorithm and returns the result.
 * @param {string} algorithm - Algorithm key (BFS, DFS, DIJKSTRA, ASTAR)
 * @param {[number,number]} start
 * @param {[number,number]} goal
 * @param {Array<[number,number]>} obstacles
 * @param {number} gridSize
 * @returns {{ path: Array, visited: Array, nodesExplored: number }}
 */
function runAlgorithm(algorithm, start, goal, obstacles, gridSize) {
  const fn = ALGORITHMS[algorithm.toUpperCase()];
  if (!fn) throw new Error(`Unknown algorithm: ${algorithm}`);
  return fn(start, goal, obstacles, gridSize);
}

module.exports = { runAlgorithm, bfs, dfs, dijkstra, astar };
