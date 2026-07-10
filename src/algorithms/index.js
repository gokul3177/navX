/**
 * @file index.js
 * @description Central algorithm registry.
 * Maps algorithm keys to their implementation functions and metadata.
 * Import from here instead of individual files for clean dependency management.
 */

import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { astar } from './astar';

/**
 * Algorithm registry: maps key → { fn, name, color, shortLabel }
 */
export const ALGORITHMS = {
  BFS: {
    fn: bfs,
    name: 'Breadth-First Search',
    shortLabel: 'BFS',
    color: '#3b82f6',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    description:
      'Explores all neighbors level by level. Guarantees the shortest path on unweighted grids.',
  },
  DFS: {
    fn: dfs,
    name: 'Depth-First Search',
    shortLabel: 'DFS',
    color: '#f59e0b',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: false,
    description:
      'Dives deep along one branch before backtracking. Fast but does not guarantee shortest path.',
  },
  DIJKSTRA: {
    fn: dijkstra,
    name: "Dijkstra's Algorithm",
    shortLabel: 'Dijkstra',
    color: '#10b981',
    timeComplexity: 'O((V+E) log V)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    description:
      'Expands nodes in order of cumulative cost. Guarantees shortest path on weighted and unweighted grids.',
  },
  ASTAR: {
    fn: astar,
    name: 'A* Search',
    shortLabel: 'A*',
    color: '#8b5cf6',
    timeComplexity: 'O((V+E) log V)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    description:
      'Heuristic-guided search using Manhattan distance. Typically explores the fewest nodes while guaranteeing the shortest path.',
  },
};

/**
 * Runs the specified algorithm.
 * @param {keyof typeof ALGORITHMS} algoKey
 * @param {[number,number]} start
 * @param {[number,number]} goal
 * @param {[number,number][]} obstacles
 * @param {number} gridSize
 * @returns {{ visited: [number,number][], path: [number,number][], nodesExplored: number }}
 */
export function runAlgorithm(algoKey, start, goal, obstacles, gridSize) {
  const algo = ALGORITHMS[algoKey];
  if (!algo) throw new Error(`Unknown algorithm: ${algoKey}`);
  return algo.fn(start, goal, obstacles, gridSize);
}

export { bfs, dfs, dijkstra, astar };
