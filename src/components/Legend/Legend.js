import React from 'react';
import './Legend.css';

export default function Legend() {
  return (
    <div className="legend-container">
      <div className="legend-item">
        <div className="legend-box legend-start"></div>
        <span>Start</span>
      </div>
      <div className="legend-item">
        <div className="legend-box legend-goal"></div>
        <span>Goal</span>
      </div>
      <div className="legend-item">
        <div className="legend-box legend-obstacle"></div>
        <span>Wall</span>
      </div>
      <div className="legend-item">
        <div className="legend-box legend-visited"></div>
        <span>Visited</span>
      </div>
      <div className="legend-item">
        <div className="legend-box legend-path"></div>
        <span>Shortest Path</span>
      </div>
    </div>
  );
}
