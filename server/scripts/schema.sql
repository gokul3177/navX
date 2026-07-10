-- PostgreSQL Schema for NavX

CREATE TABLE IF NOT EXISTS simulations (
  id SERIAL PRIMARY KEY,
  algorithm VARCHAR(50) NOT NULL,
  grid_size INT NOT NULL,
  start_point JSONB NOT NULL,
  goal_point JSONB NOT NULL,
  obstacles JSONB NOT NULL,
  path JSONB NOT NULL,
  visited_count INT NOT NULL,
  path_length INT NOT NULL,
  time_taken DECIMAL(10, 6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create index on algorithm for faster filtering
CREATE INDEX IF NOT EXISTS idx_simulations_algorithm ON simulations(algorithm);
CREATE INDEX IF NOT EXISTS idx_simulations_created_at ON simulations(created_at DESC);
