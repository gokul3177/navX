import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import './HistoryTable.css';

export default function HistoryTable({ refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getHistory(pagination.page, 10, filter);
      if (res.success) {
        setHistory(res.data.results);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filter]);

  useEffect(() => {
    fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchHistory, refreshTrigger]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) setPagination(p => ({ ...p, page: p.page - 1 }));
  };

  const handleNextPage = () => {
    if (pagination.hasNext) setPagination(p => ({ ...p, page: p.page + 1 }));
  };

  return (
    <div className="history-table-container">
      <div className="history-table-header">
        <h3>Simulation History</h3>
        <div className="table-controls">
          <select value={filter} onChange={handleFilterChange}>
            <option value="ALL">All Algorithms</option>
            <option value="BFS">BFS</option>
            <option value="DFS">DFS</option>
            <option value="DIJKSTRA">Dijkstra</option>
            <option value="ASTAR">A*</option>
          </select>
          <button onClick={fetchHistory}>↻ Refresh</button>
        </div>
      </div>

      {error ? (
        <div style={{ color: 'var(--color-error)' }}>{error}</div>
      ) : loading ? (
        <div style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      ) : history.length === 0 ? (
        <div style={{ color: 'var(--color-text-muted)' }}>No simulations recorded yet.</div>
      ) : (
        <>
          <table className="history-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Grid Size</th>
                <th>Path Length</th>
                <th>Nodes Explored</th>
                <th>Time (s)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map(row => (
                <tr key={row.id}>
                  <td>
                    <span className={`algo-tag ${row.algorithm.toLowerCase()}`}>
                      {row.algorithm}
                    </span>
                  </td>
                  <td>{row.grid_size}x{row.grid_size}</td>
                  <td>{row.path_length || 'Unreachable'}</td>
                  <td>{row.visited_count}</td>
                  <td className="mono">{Number(row.time_taken).toFixed(5)}</td>
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={!pagination.hasPrev} onClick={handlePrevPage}>&laquo; Prev</button>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <button disabled={!pagination.hasNext} onClick={handleNextPage}>Next &raquo;</button>
          </div>
        </>
      )}
    </div>
  );
}
