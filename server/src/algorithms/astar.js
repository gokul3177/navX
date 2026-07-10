export function astar(start, goal, obstacles, gridSize) {
  const visited = [];
  const openSet = [start];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const key = ([x, y]) => `${x},${y}`;
  const heuristic = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
  const obstacleSet = new Set(obstacles.map(([x, y]) => key([x, y])));
  gScore[key(start)] = 0;
  fScore[key(start)] = heuristic(start, goal);

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[key(a)] - fScore[key(b)]);
    const current = openSet.shift();
    visited.push(current);
    const [x, y] = current;

    if (x === goal[0] && y === goal[1]) {
      const path = [current];
      while (key(path[0]) in cameFrom) {
        path.unshift(cameFrom[key(path[0])]);
      }
      return { visited, path };
    }

    for (const [dx, dy] of [[1,0], [-1,0], [0,1], [0,-1]]) {
      const neighbor = [x + dx, y + dy];
      const nKey = key(neighbor);
      if (
        neighbor[0] < 0 || neighbor[0] >= gridSize || neighbor[1] < 0 || neighbor[1] >= gridSize ||
        obstacleSet.has(nKey)
      ) continue;

      const tentativeG = (gScore[key(current)] ?? Infinity) + 1;
      if (tentativeG < (gScore[nKey] ?? Infinity)) {
        cameFrom[nKey] = current;
        gScore[nKey] = tentativeG;
        fScore[nKey] = tentativeG + heuristic(neighbor, goal);
        if (!openSet.some(p => key(p) === nKey)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { visited, path: [] };
}
