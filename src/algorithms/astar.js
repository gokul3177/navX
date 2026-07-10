/**
 * @file astar.js
 * @description A* Search Algorithm.
 *
 * Uses a heuristic (Manhattan distance) to guide search toward the goal,
 * dramatically reducing nodes explored vs. Dijkstra on open grids.
 * Guarantees shortest path when heuristic is admissible (never overestimates).
 *
 * Optimization: Replaced O(n log n) openSet.sort() with a MinHeap for O(log n) extraction.
 * Added a `closed` set to skip already-finalized nodes popped from the heap.
 *
 * Time Complexity:  O((V + E) log V) — with binary heap
 * Space Complexity: O(V)
 */

import { cellKey, inBounds, buildObstacleSet, reconstructPath, DIRECTIONS, MinHeap } from './utils';

/**
 * Manhattan distance heuristic — admissible for 4-directional grids.
 * @param {[number,number]} a
 * @param {[number,number]} b
 * @returns {number}
 */
const manhattan = ([r1, c1], [r2, c2]) => Math.abs(r1 - r2) + Math.abs(c1 - c2);

/**
 * Runs A* Search from start to goal.
 *
 * @param {[number,number]} start      - Starting cell [row, col]
 * @param {[number,number]} goal       - Goal cell [row, col]
 * @param {[number,number][]} obstacles - Blocked cells
 * @param {number} gridSize             - Grid dimension (N×N)
 * @returns {{ visited: [number,number][], path: [number,number][], nodesExplored: number }}
 */
export function astar(start, goal, obstacles, gridSize) {
  const obstacleSet = buildObstacleSet(obstacles);
  const gScore = new Map([[cellKey(start[0], start[1]), 0]]);
  const parentMap = new Map();
  const visited = [];
  const closed = new Set();

  const pq = new MinHeap((a, b) => a.f - b.f);
  pq.push({ pos: start, g: 0, f: manhattan(start, goal) });

  while (!pq.isEmpty) {
    const { pos: [r, c], g } = pq.pop();
    const k = cellKey(r, c);

    // Skip already-finalized nodes (stale entries left in the heap)
    if (closed.has(k)) continue;
    closed.add(k);
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

      if (!inBounds(nr, nc, gridSize) || obstacleSet.has(nk) || closed.has(nk)) continue;

      const newG = g + 1;
      if (newG < (gScore.get(nk) ?? Infinity)) {
        gScore.set(nk, newG);
        parentMap.set(nk, [r, c]);
        pq.push({ pos: [nr, nc], g: newG, f: newG + manhattan([nr, nc], goal) });
      }
    }
  }

  return { visited, path: [], nodesExplored: visited.length };
}
