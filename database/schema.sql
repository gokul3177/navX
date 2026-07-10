-- NavX 2.0 Database Schema
-- Run this file on your Railway MySQL instance to set up the database.
-- MySQL 8.0+

-- ─────────────────────────────────────────────────────────────────────────────
-- Drop existing tables (safe for fresh setup)
-- ─────────────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `simulations`;

-- ─────────────────────────────────────────────────────────────────────────────
-- simulations: Stores every pathfinding simulation result
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE `simulations` (
  `id`            INT          NOT NULL AUTO_INCREMENT,
  `algorithm`     ENUM('BFS','DFS','DIJKSTRA','ASTAR') NOT NULL,
  `grid_size`     TINYINT      NOT NULL DEFAULT 20,
  `start_point`   JSON         NOT NULL COMMENT '[row, col]',
  `goal_point`    JSON         NOT NULL COMMENT '[row, col]',
  `obstacles`     JSON         NOT NULL COMMENT '[[row,col], ...]',
  `path`          JSON         NOT NULL COMMENT '[[row,col], ...]',
  `visited_count` INT          NOT NULL DEFAULT 0 COMMENT 'Nodes explored',
  `path_length`   INT          NOT NULL DEFAULT 0 COMMENT 'Steps in final path',
  `time_taken`    DECIMAL(10,6) NOT NULL DEFAULT 0 COMMENT 'Seconds (high precision)',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_algorithm`  (`algorithm`),
  INDEX `idx_created_at` (`created_at` DESC)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='NavX pathfinding simulation results';

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed data: Sample results for initial demo display
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO `simulations`
  (algorithm, grid_size, start_point, goal_point, obstacles, path, visited_count, path_length, time_taken)
VALUES
  ('BFS',      20, '[0,0]', '[19,19]', '[]', '[[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[15,2],[16,2],[17,2],[18,2],[19,2],[19,3],[19,4],[19,5],[19,6],[19,7],[19,8],[19,9],[19,10],[19,11],[19,12],[19,13],[19,14],[19,15],[19,16],[19,17],[19,18],[19,19]]', 256, 39, 0.000312),
  ('ASTAR',    20, '[0,0]', '[19,19]', '[]', '[[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],[11,11],[12,12],[13,13],[14,14],[15,15],[16,16],[17,17],[18,18],[19,19]]', 42, 20, 0.000089),
  ('DIJKSTRA', 20, '[0,0]', '[19,19]', '[]', '[[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[15,2],[16,2],[17,2],[18,2],[19,2],[19,3],[19,4],[19,5],[19,6],[19,7],[19,8],[19,9],[19,10],[19,11],[19,12],[19,13],[19,14],[19,15],[19,16],[19,17],[19,18],[19,19]]', 256, 39, 0.000278),
  ('DFS',      20, '[0,0]', '[19,19]', '[]', '[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],[0,10],[0,11],[0,12],[0,13],[0,14],[0,15],[0,16],[0,17],[0,18],[0,19],[1,19],[2,19],[3,19],[4,19],[5,19],[6,19],[7,19],[8,19],[9,19],[10,19],[11,19],[12,19],[13,19],[14,19],[15,19],[16,19],[17,19],[18,19],[19,19]]', 198, 39, 0.000145);
