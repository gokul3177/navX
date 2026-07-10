import { useState, useRef, useCallback } from 'react';
import { runAlgorithm } from '../algorithms';
import { api } from '../services/api';

/**
 * Custom hook to manage the pathfinding simulation and animation state.
 */
export function usePathfinder(gridSize, start, goal, obstacles) {
  const [algoKey, setAlgoKey] = useState('BFS');
  const [simulationState, setSimulationState] = useState('idle'); // idle, running, paused, done
  
  // Animation frames
  const [visited, setVisited] = useState([]);
  const [path, setPath] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [metrics, setMetrics] = useState(null);

  // We store the full result here to step through it
  const fullResult = useRef(null);
  const timerRef = useRef(null);
  const speedRef = useRef(15); // ms per step

  const clearSimulation = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setVisited([]);
    setPath([]);
    setCurrentStep(0);
    setMetrics(null);
    setSimulationState('idle');
    fullResult.current = null;
  }, []);

  const setSpeed = useCallback((val) => {
    // scale 1-10 to milliseconds (10 is fastest, ~10ms; 1 is slowest, ~150ms)
    speedRef.current = Math.max(10, 160 - (val * 15));
  }, []);

  const runSimulation = useCallback(async () => {
    if (simulationState === 'running') return;
    
    clearSimulation();
    setSimulationState('running');

    // Run client-side immediately for responsiveness
    const t0 = performance.now();
    const result = runAlgorithm(algoKey, start, goal, obstacles, gridSize);
    const t1 = performance.now();
    
    fullResult.current = result;
    const timeTaken = (t1 - t0) / 1000;
    
    setMetrics({
      nodesExplored: result.nodesExplored,
      pathLength: result.path.length,
      timeTaken,
      found: result.path.length > 0
    });

    // Start background save
    try {
      api.simulate({
        algorithm: algoKey,
        gridSize,
        start,
        goal,
        obstacles
      }).catch(err => console.error("Failed to save simulation:", err));
    } catch (e) {
      // Ignore network errors on save
    }

    // Animate
    let step = 0;
    const totalSteps = result.visited.length + result.path.length;
    
    timerRef.current = setInterval(() => {
      if (step >= totalSteps) {
        clearInterval(timerRef.current);
        setSimulationState('done');
        return;
      }
      
      setCurrentStep(step);
      
      if (step < result.visited.length) {
        setVisited(prev => [...prev, result.visited[step]]);
      } else {
        const pathStep = step - result.visited.length;
        setPath(prev => [...prev, result.path[pathStep]]);
      }
      
      step++;
    }, speedRef.current);

  }, [algoKey, start, goal, obstacles, gridSize, clearSimulation, simulationState]);

  const pauseSimulation = useCallback(() => {
    if (simulationState === 'running') {
      clearInterval(timerRef.current);
      setSimulationState('paused');
    }
  }, [simulationState]);

  const resumeSimulation = useCallback(() => {
    if (simulationState !== 'paused' || !fullResult.current) return;
    
    setSimulationState('running');
    const result = fullResult.current;
    const totalSteps = result.visited.length + result.path.length;
    let step = currentStep;

    timerRef.current = setInterval(() => {
      if (step >= totalSteps) {
        clearInterval(timerRef.current);
        setSimulationState('done');
        return;
      }
      
      setCurrentStep(step);
      
      if (step < result.visited.length) {
        setVisited(prev => [...prev, result.visited[step]]);
      } else {
        const pathStep = step - result.visited.length;
        setPath(prev => [...prev, result.path[pathStep]]);
      }
      
      step++;
    }, speedRef.current);
  }, [simulationState, currentStep]);

  return {
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
    clearSimulation,
  };
}
