import React from 'react';
import '../App.css';

export default function Grid({
  gridSize,
  start = [],
  goal = [],
  obstacles = [],
  path = [],
  visited = [],
  onCellClick
}) {
  const getCellType = (x, y) => {
    if (Array.isArray(start) && x === start[0] && y === start[1]) return 'start';
    if (Array.isArray(goal) && x === goal[0] && y === goal[1]) return 'goal';
    if (Array.isArray(obstacles) && obstacles.some(([ox, oy]) => ox === x && oy === y)) return 'obstacle';
    if (Array.isArray(path) && path.some(([px, py]) => px === x && py === y)) return 'robot';
    return '';
  };

  return (
    <div className="grid-container">
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 30px)` }}>
        {Array.from({ length: gridSize }).map((_, x) =>
          Array.from({ length: gridSize }).map((_, y) => {
            const type = getCellType(x, y);
            let backgroundColor = 'white';
            if (type === 'start') backgroundColor = 'green';
            else if (type === 'goal') backgroundColor = 'red';
            else if (type === 'obstacle') backgroundColor = 'black';
            else if (type === 'robot') backgroundColor = '#00bfff';

            return (
              <div
                key={`${x}-${y}`}
                onClick={() => onCellClick(x, y)}
                className="cell"
                style={{ backgroundColor }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
