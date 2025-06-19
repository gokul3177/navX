import React, { useEffect, useState } from 'react';

export default function ResultsTable({ refreshKey }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("https://navx-backend-production.up.railway.app/results")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("✅ Data received from /results:", data);
        setResults(data);
      })
      .catch(err => console.error('❌ Error fetching results:', err));
  }, [refreshKey]);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'center',
  };

  const thTdStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  return (
    <div style={{ margin: '40px auto', maxWidth: '95%' }}>
      <h3 style={{ textAlign: 'center' }}>Previous Results</h3>
      {results.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No results found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thTdStyle}>Algorithm</th>
              <th style={thTdStyle}>Start</th>
              <th style={thTdStyle}>Goal</th>
              <th style={thTdStyle}>Path Length</th>
              <th style={thTdStyle}>Path</th>
              <th style={thTdStyle}>Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td style={thTdStyle}>{r.algorithm}</td>
                <td style={thTdStyle}>{r.start_point}</td>
                <td style={thTdStyle}>{r.goal_point}</td>
                <td style={thTdStyle}>{r.path_length}</td>
                <td style={{ ...thTdStyle, fontFamily: 'monospace', whiteSpace: 'nowrap', overflowX: 'auto' }}>
                  {(() => {
                    try {
                      const pathArr = JSON.parse(r.path);
                      return pathArr.map((p, idx) => `[${p}]`).join(' → ');
                    } catch {
                      return r.path;
                    }
                  })()}
                </td>
                <td style={thTdStyle}>
                  {r.time_taken ? Number(r.time_taken).toFixed(4) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
