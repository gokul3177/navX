import React from 'react';
import { getAlgorithmByKey } from '../../constants/algorithms';
import './AlgorithmInfo.css';

export default function AlgorithmInfo({ algoKey }) {
  const algo = getAlgorithmByKey(algoKey);
  if (!algo) return null;

  return (
    <div className="algo-info">
      <div className="algo-header">
        <div className="algo-title" style={{ color: algo.color }}>
          {algo.name}
        </div>
        <div className="algo-badges">
          <span className={`badge ${algo.guaranteesShortestPath ? 'guarantees' : 'no-guarantee'}`}>
            {algo.guaranteesShortestPath ? 'Shortest Path' : 'Not Optimal'}
          </span>
          <span className="badge category">
            {algo.weightedGraph ? 'Weighted' : 'Unweighted'}
          </span>
        </div>
      </div>
      
      <div className="algo-body">
        <div className="algo-desc">
          <p>{algo.description}</p>
        </div>
        
        <div className="algo-complexity">
          <div className="complexity-item">
            <span className="complexity-label">Time</span>
            <span className="complexity-value">{algo.timeComplexity}</span>
          </div>
          <div className="complexity-item">
            <span className="complexity-label">Space</span>
            <span className="complexity-value">{algo.spaceComplexity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
