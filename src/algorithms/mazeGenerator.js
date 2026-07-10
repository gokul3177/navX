/**
 * @file mazeGenerator.js
 * @description Client-side maze generator using recursive backtracking.
 * Produces a perfect maze (all cells reachable, single path between any two cells).
 * Used for offline/instant maze generation without a backend call.
 */

/**
 * Generates a random maze using recursive backtracking (DFS-based).
 * @param {number} gridSize - Grid dimension (N×N)
 * @returns {[number,number][]} Array of obstacle [row, col] coordinates
 */
export function generateMaze(gridSize) {
  // Initialize: all cells are walls
  const isWall = Array.from({ length: gridSize }, () => Array(gridSize).fill(true));

  // Carve passages starting from top-left
  carve(0, 0, isWall, gridSize);

  // Always ensure start and goal cells are passable
  isWall[0][0] = false;
  isWall[gridSize - 1][gridSize - 1] = false;

  // Convert wall matrix to obstacle list
  const obstacles = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (isWall[r][c]) obstacles.push([r, c]);
    }
  }

  return obstacles;
}

/**
 * Recursively carves passages by visiting cells in random order.
 * @param {number} r
 * @param {number} c
 * @param {boolean[][]} isWall
 * @param {number} gridSize
 */
function carve(r, c, isWall, gridSize) {
  isWall[r][c] = false;

  const directions = shuffle([
    [-2, 0], [2, 0], [0, -2], [0, 2],
  ]);

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nc >= 0 && nr < gridSize && nc < gridSize && isWall[nr][nc]) {
      // Remove wall between current cell and the next cell
      isWall[r + dr / 2][c + dc / 2] = false;
      carve(nr, nc, isWall, gridSize);
    }
  }
}

/**
 * Fisher-Yates in-place shuffle.
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
