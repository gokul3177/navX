/**
 * @file bfs.js
 * @description Breadth-First Search pathfinding algorithm.
 *
 * Guarantees the shortest path on unweighted grids.
 * Explores all neighbors level-by-level using a queue (FIFO).
 *
 * Time Complexity:  O(V + E) — visits each cell and edge at most once
 * Space Complexity: O(V)     — stores visited set and parent map
 */

import { cellKey, inBounds, buildObstacleSet, reconstructPath, DIRECTIONS } from './utils';

/**
 * Runs Breadth-First Search from start to goal.
 *
 * @param {[number,number]} start      - Starting cell [row, col]
 * @param {[number,number]} goal       - Goal cell [row, col]
 * @param {[number,number][]} obstacles - Blocked cells
 * @param {number} gridSize             - Grid dimension (N×N)
 * @returns {{ visited: [number,number][], path: [number,number][], nodesExplored: number }}
 */
export function bfs(start, goal, obstacles, gridSize) {
  const obstacleSet = buildObstacleSet(obstacles);
  const queue = [start];
  const visited = [];
  const parentMap = new Map();
  const seen = new Set([cellKey(start[0], start[1])]);

  while (queue.length > 0) {
    const [r, c] = queue.shift();
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

      if (inBounds(nr, nc, gridSize) && !obstacleSet.has(nk) && !seen.has(nk)) {
        seen.add(nk);
        parentMap.set(nk, [r, c]);
        queue.push([nr, nc]);
      }
    }
  }

  return { visited, path: [], nodesExplored: visited.length };
}
