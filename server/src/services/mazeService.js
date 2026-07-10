/**
 * @file mazeService.js
 * @description Recursive backtracking maze generator.
 * Produces a perfect maze (every cell reachable, exactly one path between any two cells).
 *
 * Algorithm: Start from a random cell, carve passages by removing walls
 * between the current cell and a random unvisited neighbor.
 * Result is a list of [row, col] obstacle coordinates (walls).
 */

/**
 * Generates a random maze using recursive backtracking.
 * @param {number} gridSize - The width and height of the grid
 * @returns {{ obstacles: Array<[number, number]> }} Obstacle coordinates
 */
function generateMaze(gridSize) {
  // Initialize all cells as walls
  const isWall = Array.from({ length: gridSize }, () => Array(gridSize).fill(true));

  // Carve starting from (0, 0)
  carve(0, 0, isWall, gridSize);

  // Always ensure start and goal are open
  isWall[0][0] = false;
  isWall[gridSize - 1][gridSize - 1] = false;

  // Convert wall map to obstacle coordinate list
  const obstacles = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (isWall[r][c]) obstacles.push([r, c]);
    }
  }

  return { obstacles };
}

/**
 * Recursive carver — removes walls to create maze passages.
 * @param {number} r - Current row
 * @param {number} c - Current column
 * @param {boolean[][]} isWall - Wall map (mutated in place)
 * @param {number} gridSize
 */
function carve(r, c, isWall, gridSize) {
  isWall[r][c] = false;

  // Shuffle directions for randomness
  const directions = shuffle([
    [-2, 0], [2, 0], [0, -2], [0, 2],
  ]);

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nc >= 0 && nr < gridSize && nc < gridSize && isWall[nr][nc]) {
      // Remove the wall between current cell and neighbor
      isWall[r + dr / 2][c + dc / 2] = false;
      carve(nr, nc, isWall, gridSize);
    }
  }
}

/**
 * Fisher-Yates shuffle — in-place, returns shuffled array.
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

module.exports = { generateMaze };
