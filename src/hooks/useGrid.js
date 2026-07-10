import { useState, useCallback } from 'react';
import { generateMaze } from '../algorithms/mazeGenerator';
import { GRID } from '../constants/grid';

/**
 * Custom hook to manage the grid state: obstacles, start, goal, and size.
 */
export function useGrid(initialSize = GRID.DEFAULT_SIZE) {
  const [gridSize, setGridSize] = useState(initialSize);
  const [start, setStart] = useState([0, 0]);
  const [goal, setGoal] = useState([initialSize - 1, initialSize - 1]);
  const [obstacles, setObstacles] = useState([]);

  const changeGridSize = useCallback((newSize) => {
    const size = Math.max(GRID.MIN_SIZE, Math.min(newSize, GRID.MAX_SIZE));
    setGridSize(size);
    setStart([0, 0]);
    setGoal([size - 1, size - 1]);
    setObstacles([]);
  }, []);

  const clearObstacles = useCallback(() => {
    setObstacles([]);
  }, []);

  const generateRandomMaze = useCallback(() => {
    const newObstacles = generateMaze(gridSize);
    setObstacles(newObstacles);
    setStart([0, 0]);
    setGoal([gridSize - 1, gridSize - 1]);
  }, [gridSize]);

  const toggleObstacle = useCallback((r, c) => {
    setObstacles((prev) => {
      const isObstacle = prev.some(([or, oc]) => or === r && oc === c);
      if (isObstacle) {
        return prev.filter(([or, oc]) => or !== r || oc !== c);
      } else {
        return [...prev, [r, c]];
      }
    });
  }, []);

  const removeObstacle = useCallback((r, c) => {
    setObstacles((prev) => prev.filter(([or, oc]) => or !== r || oc !== c));
  }, []);

  return {
    gridSize,
    start,
    goal,
    obstacles,
    setStart,
    setGoal,
    changeGridSize,
    clearObstacles,
    generateRandomMaze,
    toggleObstacle,
    removeObstacle,
  };
}
