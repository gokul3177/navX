export function bfs(start, goal, obstacles, gridSize) {
  const queue = [start];
  const visited = [];
  const parentMap = new Map();
  const seen = new Set();
  const key = ([x, y]) => `${x},${y}`;
  const directions = [[0,1],[1,0],[0,-1],[-1,0]];

  seen.add(key(start));

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    visited.push([x, y]);

    if (x === goal[0] && y === goal[1]) {
      let path = [[x, y]];
      while (key(path[0]) in parentMap) {
        path.unshift(parentMap[key(path[0])]);
      }
      return { visited, path };
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy;
      const posKey = key([nx, ny]);
      if (
        nx >= 0 && ny >= 0 &&
        nx < gridSize && ny < gridSize &&
        !obstacles.some(([ox, oy]) => ox === nx && oy === ny) &&
        !seen.has(posKey)
      ) {
        queue.push([nx, ny]);
        seen.add(posKey);
        parentMap[posKey] = [x, y];
      }
    }
  }

  return { visited, path: [] };
}
