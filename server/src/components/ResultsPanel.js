import React from 'react';

export default function ResultsPanel({ algorithm, visitedCount, pathLength, timeTaken }) {
  return (
    <div style={{
      padding: '15px',
      border: '2px solid #ccc',
      borderRadius: '10px',
      width: '280px',
      background: '#f9f9f9',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>📊 Results</h3>

      <p><strong>🧠 Algorithm:</strong> {algorithm}</p>
      <p><strong>⏱️ Time:</strong> {timeTaken.toFixed(4)} seconds</p>

      <div style={{ marginTop: '10px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Path Length</strong>
            <span>{pathLength}</span>
          </div>
          <div style={{
            width: `${pathLength * 5}px`,
            height: '12px',
            background: '#4caf50',
            borderRadius: '4px',
            marginTop: '4px'
          }} />
        </div>
      </div>
    </div>
  );
}
