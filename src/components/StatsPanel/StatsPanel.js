import React, { useEffect, useState } from 'react';
import './StatsPanel.css';

// Simple hook to animate numbers counting up
function useAnimatedNumber(value, duration = 1000) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === null || value === undefined) {
      setDisplayValue(0);
      return;
    }

    let startTimestamp = null;
    const startValue = displayValue;
    const endValue = value;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutQuad)
      const ease = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(startValue + (endValue - startValue) * ease);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    window.requestAnimationFrame(step);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return displayValue;
}

export default function StatsPanel({ metrics }) {
  const animatedNodes = useAnimatedNumber(metrics?.nodesExplored || 0, 800);
  const animatedLength = useAnimatedNumber(metrics?.pathLength || 0, 800);
  const animatedTime = useAnimatedNumber(metrics?.timeTaken || 0, 800);

  if (!metrics) return null;

  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-header">
          <span>🔍</span> Nodes Explored
        </div>
        <div className="stat-value">{Math.round(animatedNodes)}</div>
        <div className="stat-footer">Lower is better</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <span>📏</span> Path Length
        </div>
        <div className={`stat-value ${metrics.found ? 'success' : 'error'}`}>
          {metrics.found ? Math.round(animatedLength) : 'No Path'}
        </div>
        <div className="stat-footer">{metrics.found ? 'Steps to goal' : 'Unreachable'}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <span>⏱️</span> Execution Time
        </div>
        <div className="stat-value">{animatedTime.toFixed(4)}s</div>
        <div className="stat-footer">Client-side processing</div>
      </div>
    </div>
  );
}
