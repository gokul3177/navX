-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: pathfinder
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `paths`
--

DROP TABLE IF EXISTS `paths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paths` (
  `id` int NOT NULL AUTO_INCREMENT,
  `algorithm` varchar(20) DEFAULT NULL,
  `start_point` varchar(100) DEFAULT NULL,
  `goal_point` varchar(100) DEFAULT NULL,
  `obstacles` text,
  `path` text,
  `visited_count` int DEFAULT NULL,
  `path_length` int DEFAULT NULL,
  `time_taken` float DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paths`
--

LOCK TABLES `paths` WRITE;
/*!40000 ALTER TABLE `paths` DISABLE KEYS */;
INSERT INTO `paths` VALUES (1,'BFS','[0,0]','[9,9]','[[3,4],[3,3],[3,2],[4,2],[5,2],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[7,7],[2,5],[3,5],[1,5],[1,6]]','[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9]]',84,19,0.0028,'2025-06-18 17:40:53'),(2,'DFS','[0,0]','[9,9]','[[3,4],[3,3],[3,2],[4,2],[5,2],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[7,7],[2,5],[3,5],[1,5],[1,6]]','[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],[1,9],[2,9],[2,8],[2,7],[2,6],[3,6],[4,6],[4,7],[4,8],[4,9],[5,9],[6,9],[6,8],[7,8],[8,8],[8,9],[9,9]]',69,27,0.002,'2025-06-18 17:40:55'),(3,'ASTAR','[0,0]','[9,9]','[[3,4],[3,3],[3,2],[4,2],[5,2],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[7,7],[2,5],[3,5],[1,5],[1,6]]','[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8],[9,9]]',74,19,0.0023,'2025-06-18 17:40:58'),(4,'DIJKSTRA','[0,0]','[9,9]','[[3,4],[3,3],[3,2],[4,2],[5,2],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[7,7],[2,5],[3,5],[1,5],[1,6]]','[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8],[9,9]]',84,19,0.0011,'2025-06-18 17:41:00');
/*!40000 ALTER TABLE `paths` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-19 14:44:49
