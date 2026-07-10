/**
 * @file dfs.js
 * @description Depth-First Search pathfinding algorithm.
 *
 * Does NOT guarantee the shortest path — explores deep branches first.
 * Useful for maze exploration and exhaustive path finding.
 *
 * Time Complexity:  O(V + E)
 * Space Complexity: O(V)
 *
 * Bug fix: Previous version declared `const parent = new Map()` but used
 * it as a plain object (`parent[key] = ...`). Now consistently uses Map.
 */

import { cellKey, inBounds, buildObstacleSet, reconstructPath, DIRECTIONS } from './utils';

/**
 * Runs Depth-First Search from start to goal.
 *
 * @param {[number,number]} start      - Starting cell [row, col]
 * @param {[number,number]} goal       - Goal cell [row, col]
 * @param {[number,number][]} obstacles - Blocked cells
 * @param {number} gridSize             - Grid dimension (N×N)
 * @returns {{ visited: [number,number][], path: [number,number][], nodesExplored: number }}
 */
export function dfs(start, goal, obstacles, gridSize) {
  const obstacleSet = buildObstacleSet(obstacles);
  const stack = [start];
  const visited = [];
  const parentMap = new Map();
  const seen = new Set([cellKey(start[0], start[1])]);

  while (stack.length > 0) {
    const [r, c] = stack.pop();
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
        stack.push([nr, nc]);
      }
    }
  }

  return { visited, path: [], nodesExplored: visited.length };
}
