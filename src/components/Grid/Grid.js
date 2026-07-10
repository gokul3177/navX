import React, { useState, useCallback, useMemo } from 'react';
import { GRID, MODES } from '../../constants/grid';
import './Grid.css';

export default function Grid({
  gridSize,
  start,
  goal,
  obstacles,
  visited,
  path,
  mode,
  setStart,
  setGoal,
  toggleObstacle,
  removeObstacle,
  simulationState
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Fast lookups using Sets of stringified coordinates "r,c"
  const obstacleSet = useMemo(() => {
    const validObstacles = (obstacles || []).filter(Boolean);
    if (validObstacles.length !== (obstacles || []).length) console.warn("Undefined found in obstacles:", obstacles);
    return new Set(validObstacles.map(([r, c]) => `${r},${c}`));
  }, [obstacles]);

  const visitedSet = useMemo(() => {
    const validVisited = (visited || []).filter(Boolean);
    if (validVisited.length !== (visited || []).length) console.warn("Undefined found in visited:", visited);
    return new Set(validVisited.map(([r, c]) => `${r},${c}`));
  }, [visited]);

  const pathSet = useMemo(() => {
    const validPath = (path || []).filter(Boolean);
    if (validPath.length !== (path || []).length) console.warn("Undefined found in path:", path);
    return new Set(validPath.map(([r, c]) => `${r},${c}`));
  }, [path]);

  const handlePointerDown = (r, c) => {
    if (simulationState === 'running') return;
    setIsMouseDown(true);
    handleCellInteraction(r, c);
  };

  const handlePointerEnter = (r, c) => {
    if (!isMouseDown || simulationState === 'running') return;
    handleCellInteraction(r, c);
  };

  const handlePointerUp = () => {
    setIsMouseDown(false);
  };

  const handleCellInteraction = useCallback((r, c) => {
    // Cannot overwrite start or goal unless moving them
    const isStart = r === start[0] && c === start[1];
    const isGoal = r === goal[0] && c === goal[1];

    switch (mode) {
      case MODES.START:
        if (!isGoal) setStart([r, c]);
        break;
      case MODES.GOAL:
        if (!isStart) setGoal([r, c]);
        break;
      case MODES.OBSTACLE:
        if (!isStart && !isGoal && !obstacleSet.has(`${r},${c}`)) {
          toggleObstacle(r, c);
        }
        break;
      case MODES.ERASER:
        if (obstacleSet.has(`${r},${c}`)) {
          removeObstacle(r, c);
        }
        break;
      default:
        break;
    }
  }, [mode, start, goal, obstacleSet, setStart, setGoal, toggleObstacle, removeObstacle]);

  // Prevent default drag behavior to allow custom pointer events
  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  const cellSize = Math.min(GRID.CELL_SIZE, Math.floor(600 / gridSize));

  return (
    <div 
      className="grid-container" 
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div 
        id="grid-snapshot"
        className="grid-board"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`
        }}
        onDragStart={preventDragHandler}
      >
        {Array.from({ length: gridSize }).map((_, r) =>
          Array.from({ length: gridSize }).map((_, c) => {
            const key = `${r},${c}`;
            const isStart = r === start[0] && c === start[1];
            const isGoal = r === goal[0] && c === goal[1];
            const isObstacle = obstacleSet.has(key);
            const isPath = pathSet.has(key);
            const isVisited = visitedSet.has(key) && !isPath; // Path overwrites visited

            let className = 'cell';
            if (isStart) className += ' is-start';
            else if (isGoal) className += ' is-goal';
            else if (isPath) className += ' is-path';
            else if (isObstacle) className += ' is-obstacle';
            else if (isVisited) className += ' is-visited';

            return (
              <div
                key={key}
                className={className}
                onPointerDown={() => handlePointerDown(r, c)}
                onPointerEnter={() => handlePointerEnter(r, c)}
                title={`(${r}, ${c})`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
