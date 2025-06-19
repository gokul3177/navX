import React from 'react';

export default function ControlPanel({
  algo,
  setAlgo,
  setMode,
  startSimulation,
  onClear,
  onExport,
  onExportGrid
}) {
  return (
    <div style={{
      margin: '20px auto',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
      maxWidth: '700px'
    }}>
      {/* Mode buttons */}
      <button onClick={() => setMode('start')}>Set Start</button>
      <button onClick={() => setMode('goal')}>Set Goal</button>
      <button onClick={() => setMode('obstacle')}>Add Obstacle</button>

      {/* Algorithm selection */}
      <button
        onClick={() => setAlgo('bfs')}
        style={{ backgroundColor: algo === 'bfs' ? 'yellow' : '' }}
      >
        BFS
      </button>
      <button
        onClick={() => setAlgo('dfs')}
        style={{ backgroundColor: algo === 'dfs' ? 'yellow' : '' }}
      >
        DFS
      </button>
      <button
        onClick={() => setAlgo('astar')}
        style={{ backgroundColor: algo === 'astar' ? 'yellow' : '' }}
      >
        A*
      </button>
      <button
        onClick={() => setAlgo('dijkstra')}
        style={{ backgroundColor: algo === 'dijkstra' ? 'yellow' : '' }}
      >
        Dijkstra
      </button>

      {/* Action buttons */}
      <button onClick={startSimulation} style={{ backgroundColor: '#007bff', color: 'white' }}>
        Simulate
      </button>
      <button onClick={onClear}>Clear</button>
      <button onClick={onExport}>Export JSON</button>
      <button onClick={onExportGrid}>Download Grid</button>
    </div>
  );
}
