/**
 * @file algorithmController.js
 * @description Returns static metadata about supported algorithms.
 * Used by the frontend to display algorithm descriptions and complexity info.
 */

const { sendSuccess } = require('../utils/responseHelper');

const ALGORITHM_METADATA = [
  {
    key: 'BFS',
    name: 'Breadth-First Search',
    description:
      'Explores all neighbors level by level before moving deeper. Guarantees the shortest path on unweighted grids by systematically visiting nodes in order of their distance from the source.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    weightedGraph: false,
    category: 'uninformed',
    color: '#3b82f6',
  },
  {
    key: 'DFS',
    name: 'Depth-First Search',
    description:
      'Dives as deep as possible along each branch before backtracking. Does NOT guarantee the shortest path. Useful for exploring all possible paths or when memory is constrained.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: false,
    weightedGraph: false,
    category: 'uninformed',
    color: '#f59e0b',
  },
  {
    key: 'DIJKSTRA',
    name: "Dijkstra's Algorithm",
    description:
      "Finds the shortest path by greedily expanding the node with the lowest cumulative cost. Works on weighted graphs. On unweighted grids it behaves like BFS but with a priority queue — exploring nodes in cost order.",
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    weightedGraph: true,
    category: 'informed',
    color: '#10b981',
  },
  {
    key: 'ASTAR',
    name: 'A* Search',
    description:
      'Combines Dijkstra\'s cost-so-far with a heuristic estimate of the remaining distance (Manhattan distance). Focuses the search toward the goal, typically exploring far fewer nodes than Dijkstra while still guaranteeing the shortest path.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    guaranteesShortestPath: true,
    weightedGraph: true,
    category: 'informed',
    color: '#8b5cf6',
  },
];

/**
 * GET /api/algorithms
 * Returns metadata for all supported pathfinding algorithms.
 */
function getAlgorithms(req, res) {
  return sendSuccess(res, { algorithms: ALGORITHM_METADATA });
}

module.exports = { getAlgorithms };
