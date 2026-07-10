import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import ControlPanel from './components/ControlPanel/ControlPanel';
import Grid from './components/Grid/Grid';
import Legend from './components/Legend/Legend';
import AlgorithmInfo from './components/AlgorithmInfo/AlgorithmInfo';
import StatsPanel from './components/StatsPanel/StatsPanel';
import HistoryTable from './components/HistoryTable/HistoryTable';
import { useGrid } from './hooks/useGrid';
import { usePathfinder } from './hooks/usePathfinder';
import { MODES } from './constants/grid';

export default function App() {
  const {
    gridSize,
    start,
    goal,
    obstacles,
    setStart,
    setGoal,
    generateRandomMaze,
    clearObstacles,
    toggleObstacle,
    removeObstacle
  } = useGrid(20);

  const {
    algoKey,
    setAlgoKey,
    simulationState,
    visited,
    path,
    metrics,
    setSpeed,
    runSimulation,
    pauseSimulation,
    resumeSimulation,
    clearSimulation
  } = usePathfinder(gridSize, start, goal, obstacles);

  const [mode, setMode] = useState(MODES.START);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleRun = () => {
    runSimulation();
    // Refresh history after a short delay to allow backend to save
    setTimeout(() => setRefreshHistory(prev => prev + 1), 500);
  };

  const handleClear = () => {
    clearSimulation();
    clearObstacles();
  };

  const handleMaze = () => {
    clearSimulation();
    generateRandomMaze();
  };

  return (
    <div className="App">
      <Navbar />
      
      <main style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto', padding: 'var(--space-6)' }}>
        
        <ControlPanel
          algoKey={algoKey}
          setAlgoKey={setAlgoKey}
          mode={mode}
          setMode={setMode}
          simulationState={simulationState}
          onRun={handleRun}
          onPause={pauseSimulation}
          onResume={resumeSimulation}
          onClear={handleClear}
          onGenerateMaze={handleMaze}
          onSpeedChange={setSpeed}
        />

        <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Grid
              gridSize={gridSize}
              start={start}
              goal={goal}
              obstacles={obstacles}
              visited={visited}
              path={path}
              mode={mode}
              setStart={setStart}
              setGoal={setGoal}
              toggleObstacle={toggleObstacle}
              removeObstacle={removeObstacle}
              simulationState={simulationState}
            />
            <Legend />
          </div>

          <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
            <AlgorithmInfo algoKey={algoKey} />
            <StatsPanel metrics={metrics} />
          </div>

        </div>

        <HistoryTable refreshTrigger={refreshHistory} />
        
      </main>
      
      <footer style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
        Built with ❤️ by Team NavX • React + Node.js
      </footer>
    </div>
  );
}
