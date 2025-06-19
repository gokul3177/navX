import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import html2canvas from 'html2canvas';
import ControlPanel from './components/ControlPanel';
import ResultsPanel from './components/ResultsPanel';
import ResultsTable from './components/ResultsTable';

import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { astar } from './algorithms/astar';
import { dijkstra } from './algorithms/dijkstra';

export default function App() {
  const [gridSize] = useState(10);
  const [grid, setGrid] = useState(
  Array.from({ length: 10 }, () => Array(10).fill(''))
);
  const [start, setStart] = useState([0, 0]);
  const [goal, setGoal] = useState([9, 9]);
  const [obstacles, setObstacles] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [algo, setAlgo] = useState('bfs');
  const [mode, setMode] = useState('start');
  const [path, setPath] = useState([]);
  const [visited, setVisited] = useState([]);
  const [metrics, setMetrics] = useState({ visitedCount: 0, pathLength: 0, timeTaken: 0 });

  // ✅ UseEffect to log grid (resolve eslint unused-vars warning)
  useEffect(() => {
    if (grid.length > 0) {
      console.log("Grid updated:", grid);
    }
  }, [grid]);

  const handleCellClick = (x, y) => {
    if (mode === 'start') setStart([x, y]);
    else if (mode === 'goal') setGoal([x, y]);
    else if (mode === 'obstacle') {
      if (!obstacles.some(([ox, oy]) => ox === x && oy === y)) {
        setObstacles([...obstacles, [x, y]]);
      }
    }
  };

  const startSimulation = async () => {
  if (!Array.isArray(start) || !Array.isArray(goal) || start.length !== 2 || goal.length !== 2) {
    alert("Please set both Start and Goal points.");
    return;
  }

  let result = { path: [], visited: [] };
  const t0 = performance.now();

  if (algo === 'bfs') result = bfs(start, goal, obstacles, gridSize);
  else if (algo === 'dfs') result = dfs(start, goal, obstacles, gridSize);
  else if (algo === 'astar') result = astar(start, goal, obstacles, gridSize);
  else if (algo === 'dijkstra') result = dijkstra(start, goal, obstacles, gridSize);

  const t1 = performance.now();
  const elapsedTime = (t1 - t0) / 1000;

  setMetrics({
    visitedCount: result.visited.length,
    pathLength: result.path.length,
    timeTaken: elapsedTime
  });

  setPath(result.path || []);
  setVisited(result.visited || []);
  animatePath(result.path || []);

  const payload = {
    algorithm: algo.toUpperCase(),
    start,
    goal,
    obstacles,
    path: result.path,
    visitedCount: result.visited.length,
    pathLength: result.path.length,
    timeTaken: elapsedTime
  };

  console.log("📦 Sending path to backend:", payload);

  try {
    const res = await fetch('https://navx-backend-production.up.railway.app/save-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      console.log('✅ Path saved successfully:', data);
      setRefreshKey(prev => prev + 1);
    } else {
      console.error('❌ Server responded with error:', res.status, data);
    }
  } catch (error) {
    console.error('❌ Network error while saving path:', error);
  }
};


  const animatePath = (path = []) => {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= path.length) {
      clearInterval(interval);
      return;
    }

    const step = path[i];
    if (!Array.isArray(step) || step.length !== 2) {
      i++;
      return;
    }

    setGrid(() => {
      const newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
      for (const [ox, oy] of obstacles) newGrid[ox][oy] = 'obstacle';
      if (Array.isArray(start) && start.length === 2) newGrid[start[0]][start[1]] = 'start';
      if (Array.isArray(goal) && goal.length === 2) newGrid[goal[0]][goal[1]] = 'goal';

      const [x, y] = step;
      newGrid[x][y] = 'robot';
      return newGrid;
    });

    i++;
  }, 100);
};


  const exportJSON = () => {
    const data = {
      algorithm: algo.toUpperCase(),
      start,
      goal,
      obstacles,
      path,
      visited,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `path-${algo}-${Date.now()}.json`;
    a.click();
  };

  const exportGridAsImage = () => {
    const gridElement = document.getElementById('grid-snapshot');
    if (!gridElement) return;

    html2canvas(gridElement).then(canvas => {
      const link = document.createElement('a');
      link.download = `grid-${algo}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
        NAVX
      </h2>

      <ControlPanel
        algo={algo}
        setAlgo={setAlgo}
        setMode={setMode}
        startSimulation={startSimulation}
        onClear={() => {
          setStart([0, 0]);
          setGoal([9, 9]);
          setObstacles([]);
          setPath([]);
          setVisited([]);
          setGrid([]);
          setMetrics({ visitedCount: 0, pathLength: 0, timeTaken: 0 });
        }}
        onExport={exportJSON}
        onExportGrid={exportGridAsImage}
      />

      <div id="grid-snapshot">
        <Grid
          gridSize={gridSize}
          grid={grid}
          start={start}
          goal={goal}
          obstacles={obstacles}
          path={path}
          visited={visited}
          onCellClick={handleCellClick}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <ResultsPanel
          algorithm={algo.toUpperCase()}
          visitedCount={metrics.visitedCount}
          pathLength={metrics.pathLength}
          timeTaken={metrics.timeTaken}
        />
      </div>

      <ResultsTable refreshKey={refreshKey} />


      <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '14px', color: '#777' }}>
        Built with ❤️ by Team NavX for RCS
      </p>
    </div>
  );
}
