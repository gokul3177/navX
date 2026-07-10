export const GRID = {
  MIN_SIZE: 5,
  MAX_SIZE: 50,
  DEFAULT_SIZE: 20,
  CELL_SIZE: 30, // px
};

export const CELL_TYPES = {
  EMPTY: 'empty',
  START: 'start',
  GOAL: 'goal',
  OBSTACLE: 'obstacle',
  VISITED: 'visited',
  PATH: 'path',
  ROBOT: 'robot',
};

export const MODES = {
  START: 'start',
  GOAL: 'goal',
  OBSTACLE: 'obstacle',
  ERASER: 'eraser',
};

export const SIMULATION_SPEED = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 5,
  // Delay calculation: Math.max(10, 200 - (speed * 18))
  // Speed 1: ~182ms per step
  // Speed 5: ~110ms per step
  // Speed 10: ~20ms per step
};
