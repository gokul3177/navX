/**
 * @file dijkstra.js
 * @description Dijkstra's Shortest Path Algorithm.
 *
 * Guarantees the shortest path. Uses a MinHeap (binary heap) priority queue
 * for O(log n) extraction, replacing the previous O(n log n) array.sort() approach.
 *
 * Time Complexity:  O((V + E) log V) — with binary heap
 * Space Complexity: O(V)
 */

import { cellKey, inBounds, buildObstacleSet, reconstructPath, DIRECTIONS, MinHeap } from './utils';

/**
 * Runs Dijkstra's algorithm from start to goal.
 *
 * @param {[number,number]} start      - Starting cell [row, col]
 * @param {[number,number]} goal       - Goal cell [row, col]
 * @param {[number,number][]} obstacles - Blocked cells
 * @param {number} gridSize             - Grid dimension (N×N)
 * @returns {{ visited: [number,number][], path: [number,number][], nodesExplored: number }}
 */
export function dijkstra(start, goal, obstacles, gridSize) {
  const obstacleSet = buildObstacleSet(obstacles);
  const dist = new Map([[cellKey(start[0], start[1]), 0]]);
  const parentMap = new Map();
  const visited = [];
  const finalized = new Set();

  const pq = new MinHeap((a, b) => a.cost - b.cost);
  pq.push({ pos: start, cost: 0 });

  while (!pq.isEmpty) {
    const { pos: [r, c], cost } = pq.pop();
    const k = cellKey(r, c);

    // Skip if already finalized (stale entry in the heap)
    if (finalized.has(k)) continue;
    finalized.add(k);
    visited.push([r, c]);

    if (r === goal[0] && c === goal[1]) {
      return {
        visited,
        path: reconstructPath(parentMap, start, goal),
        nodesExplored: visited.length,
      };
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = cellKey(nr, nc);

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
