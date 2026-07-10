import React, { useState } from 'react';
import { ALGORITHMS } from '../../constants/algorithms';
import { MODES, SIMULATION_SPEED } from '../../constants/grid';
import './ControlPanel.css';

export default function ControlPanel({
  algoKey,
  setAlgoKey,
  mode,
  setMode,
  simulationState,
  onRun,
  onPause,
  onResume,
  onClear,
  onGenerateMaze,
  onSpeedChange
}) {
  const [speed, setSpeed] = useState(SIMULATION_SPEED.DEFAULT);

  const handleSpeedChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setSpeed(val);
    onSpeedChange(val);
  };

  const isRunning = simulationState === 'running';
  const isPaused = simulationState === 'paused';
  const isDone = simulationState === 'done';
  const isLocked = isRunning || isPaused || isDone;

  return (
    <div className="control-panel">
      {/* Top Row: Algorithms & Primary Action */}
      <div className="panel-row spaced">
        <div className="control-group">
          {ALGORITHMS.map(algo => (
            <button
              key={algo.key}
              disabled={isLocked}
              className={`control-btn algo-${algo.key.toLowerCase()} ${algoKey === algo.key ? 'active' : ''}`}
              onClick={() => setAlgoKey(algo.key)}
            >
              {algo.shortLabel}
            </button>
          ))}
        </div>

        <div className="action-group">
          {simulationState === 'idle' && (
            <button className="btn-primary" onClick={onRun}>
              ▶ Visualize {ALGORITHMS.find(a => a.key === algoKey)?.shortLabel}
            </button>
          )}
          {isRunning && (
            <button className="btn-primary" onClick={onPause} style={{ backgroundColor: 'var(--color-warning)' }}>
              ⏸ Pause
            </button>
          )}
          {isPaused && (
            <button className="btn-primary" onClick={onResume} style={{ backgroundColor: 'var(--color-success)' }}>
              ▶ Resume
            </button>
          )}
          {isDone && (
            <button className="btn-primary" disabled>
              ✓ Completed
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Modes & Utilities */}
      <div className="panel-row spaced">
        <div className="control-group">
          <button
            disabled={isLocked}
            className={`control-btn ${mode === MODES.START ? 'active' : ''}`}
            onClick={() => setMode(MODES.START)}
          >
            🟢 Start
          </button>
          <button
            disabled={isLocked}
            className={`control-btn ${mode === MODES.GOAL ? 'active' : ''}`}
            onClick={() => setMode(MODES.GOAL)}
          >
            🔴 Goal
          </button>
          <button
            disabled={isLocked}
            className={`control-btn ${mode === MODES.OBSTACLE ? 'active' : ''}`}
            onClick={() => setMode(MODES.OBSTACLE)}
          >
            🧱 Wall
          </button>
          <button
            disabled={isLocked}
            className={`control-btn ${mode === MODES.ERASER ? 'active' : ''}`}
            onClick={() => setMode(MODES.ERASER)}
          >
            🧹 Erase
          </button>
        </div>

        <div className="slider-group">
          <span>Speed</span>
          <input
            type="range"
            min={SIMULATION_SPEED.MIN}
            max={SIMULATION_SPEED.MAX}
            value={speed}
            onChange={handleSpeedChange}
            className="slider"
          />
          <span style={{ width: '20px', textAlign: 'right' }}>{speed}</span>
        </div>

        <div className="control-group" style={{ background: 'transparent', border: 'none' }}>
          <button 
            className="btn-danger" 
            onClick={onGenerateMaze}
            disabled={isLocked}
          >
            🎲 Maze
          </button>
          <button 
            className="btn-danger" 
            onClick={onClear}
          >
            🗑 Clear Board
          </button>
        </div>
      </div>
    </div>
  );
}
