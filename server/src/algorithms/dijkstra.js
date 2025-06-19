export function dijkstra(start, goal, obstacles, gridSize) {
  const visited = [];
  const distance = {};
  const parent = {};
  const queue = [];
  const key = ([x, y]) => `${x},${y}`;
  const obstacleSet = new Set(obstacles.map(([x, y]) => key([x, y])));
  distance[key(start)] = 0;
  queue.push({ pos: start, dist: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const { pos: [x, y], dist } = queue.shift();
    visited.push([x, y]);

    if (x === goal[0] && y === goal[1]) {
      const path = [[x, y]];
      while (key(path[0]) in parent) {
        path.unshift(parent[key(path[0])]);
      }
      return { visited, path };
    }

    for (const [dx, dy] of [[1,0], [-1,0], [0,1], [0,-1]]) {
      const nx = x + dx, ny = y + dy;
      const nKey = key([nx, ny]);
      if (
        nx >= 0 && nx < gridSize &&
        ny >= 0 && ny < gridSize &&
        !obstacleSet.has(nKey) &&
        !(nKey in distance)
      ) {
        distance[nKey] = dist + 1;
        parent[nKey] = [x, y];
        queue.push({ pos: [nx, ny], dist: dist + 1 });
      }
    }
  }

  return { visited, path: [] };
}
