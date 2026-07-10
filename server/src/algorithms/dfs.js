export function dfs(start, goal, obstacles, gridSize) {
  const stack = [start];
  const visited = [];
  const parent = new Map();
  const seen = new Set();
  const key = ([x, y]) => `${x},${y}`;
  seen.add(key(start));

  const directions = [[1,0],[-1,0],[0,1],[0,-1]];

  while (stack.length > 0) {
    const [x, y] = stack.pop();
    visited.push([x, y]);

    if (x === goal[0] && y === goal[1]) {
      let path = [[x, y]];
      while (key(path[0]) in parent) {
        path.unshift(parent[key(path[0])]);
      }
      return { visited, path };
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy;
      const posKey = key([nx, ny]);
      if (
        nx >= 0 && ny >= 0 &&
        nx < gridSize && ny < gridSize &&
        !seen.has(posKey) &&
        !obstacles.some(([ox, oy]) => ox === nx && oy === ny)
      ) {
        stack.push([nx, ny]);
        seen.add(posKey);
        parent[posKey] = [x, y];
      }
    }
  }

  return { visited, path: [] };
}
