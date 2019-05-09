CREATE DATABASE  IF NOT EXISTS `metamebelmodern` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `metamebelmodern`;
-- MySQL dump 10.13  Distrib 8.0.15, for Win64 (x86_64)
--
-- Host: localhost    Database: metamebelmodern
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `tshirtID` int(11) NOT NULL,
  `text` mediumtext NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userIDx_idx` (`userID`),
  KEY `tshirtIDx_idx` (`tshirtID`),
  FULLTEXT KEY `searchIndex` (`text`),
  CONSTRAINT `tshirtIDx` FOREIGN KEY (`tshirtID`) REFERENCES `tshirts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userIDx` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (13,41,11,'Best.Realy','2019-04-28 01:00:52'),(17,41,13,'LastBest','2019-04-28 01:00:52'),(44,41,13,'Hello','2019-04-29 00:16:50'),(48,41,16,'Крутая','2019-04-29 00:20:59'),(49,41,16,'Ну не то что бы...','2019-04-29 00:21:17'),(50,1,16,'Как дела ?','2019-04-29 00:55:32'),(51,1,11,'Как дела ?','2019-04-29 00:58:04'),(52,1,16,'Чё как?','2019-04-29 00:58:18'),(53,1,16,'Чё как?','2019-04-29 00:58:26'),(54,1,16,'Как Дела?','2019-04-29 00:58:37'),(57,41,16,'НОРРМ!','2019-04-29 01:21:12'),(58,1,16,'8','2019-04-29 02:20:45'),(59,1,16,'89','2019-04-29 02:20:47'),(60,1,16,'8910','2019-04-29 02:20:51'),(61,1,16,'8910','2019-04-29 02:21:24'),(62,1,16,'12','2019-04-29 02:21:38'),(63,41,16,'222','2019-04-29 02:27:07'),(64,1,14,'Арыв','2019-04-29 15:05:37'),(65,1,14,'ghadsgsadg','2019-04-29 15:10:42');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `comments_AFTER_INSERT` AFTER INSERT ON `comments` FOR EACH ROW BEGIN
    SET @quantity := (SELECT COUNT(*) 
	FROM comments 
	WHERE userID = NEW.userID);
    IF @quantity = 5 THEN
		INSERT INTO `usermedals` (`userID`, `medalD`)
		VALUES(NEW.userID, 1);
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `comments_AFTER_DELETE` AFTER DELETE ON `comments` FOR EACH ROW BEGIN
    SET @quantity := (SELECT COUNT(*) 
	FROM comments 
	WHERE userID = OLD.userID);
    IF @quantity < 5 THEN
		DELETE FROM `usermedals`
		WHERE userID = OLD.userID AND medalD = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `commentID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userIDy_idx` (`userID`),
  KEY `commentIDy_idx` (`commentID`),
  CONSTRAINT `commentIDy` FOREIGN KEY (`commentID`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userIDy` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (15,1,53),(16,41,57),(19,1,52),(22,1,49),(23,1,50),(25,1,54),(28,1,57);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `likes_AFTER_INSERT` AFTER INSERT ON `likes` FOR EACH ROW BEGIN
    SET @quantity := (SELECT COUNT(*) 
	FROM likes 
	WHERE userID = NEW.userID);
    IF @quantity = 10 THEN
		INSERT INTO `usermedals` (`userID`, `medalD`)
		VALUES(NEW.userID, 3);
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `likes_AFTER_DELETE` AFTER DELETE ON `likes` FOR EACH ROW BEGIN
    SET @quantity := (SELECT COUNT(*) 
	FROM likes 
	WHERE userID = OLD.userID);
    IF @quantity < 10 THEN
		DELETE FROM `usermedals`
		WHERE userID = OLD.userID AND medalD = 3;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `medals`
--

DROP TABLE IF EXISTS `medals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `medals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shortText` varchar(120) NOT NULL,
  `imageAddress` varchar(120) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medals`
--

LOCK TABLES `medals` WRITE;
/*!40000 ALTER TABLE `medals` DISABLE KEYS */;
INSERT INTO `medals` VALUES (1,'5 коментов','1.png'),(2,'3 майки','2.png'),(3,'10 лайков','3.png');
/*!40000 ALTER TABLE `medals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) DEFAULT NULL,
  `address` varchar(120) NOT NULL,
  `phone` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userIDxo_idx` (`userID`),
  CONSTRAINT `userIDxo` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (7,1,'7','7'),(8,1,'САМОВЫВОЗ','+375 33 303 81 89'),(9,1,'САМОВЫВОЗ','+375 33 912 23 12'),(10,1,'Минск, Леонтьева к5','+375 33 912 23 12'),(11,1,'САМОВЫВОЗ','+375 29 320 23 23'),(12,1,'САМОВЫВОЗ','u778787'),(13,52,'Минск Беды 4','+375 33 3029188'),(14,1,'Минск','678678'),(15,1,'123','йцукен');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordertshirts`
--

DROP TABLE IF EXISTS `ordertshirts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ordertshirts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tshirtID` int(11) NOT NULL,
  `orderID` int(11) NOT NULL,
  `gender` varchar(45) NOT NULL,
  `size` varchar(45) NOT NULL,
  `color` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderID_idx` (`orderID`),
  KEY `thisrtIDofOrder_idx` (`tshirtID`),
  CONSTRAINT `orderID` FOREIGN KEY (`orderID`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `thisrtIDofOrder` FOREIGN KEY (`tshirtID`) REFERENCES `tshirts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordertshirts`
--

LOCK TABLES `ordertshirts` WRITE;
/*!40000 ALTER TABLE `ordertshirts` DISABLE KEYS */;
INSERT INTO `ordertshirts` VALUES (1,13,7,'Мужская','S','#000000'),(2,12,8,'Женская','X','#00ff00'),(3,12,9,'Женская','X','#000080'),(4,12,10,'Мужская','L','#000080'),(5,12,11,'Мужская','S','#000000'),(6,16,12,'Мужская','X','#000ac1'),(8,11,14,'Мужская','S','#008000'),(9,11,15,'Мужская','S','#000080');
/*!40000 ALTER TABLE `ordertshirts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rankings`
--

DROP TABLE IF EXISTS `rankings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `rankings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` double NOT NULL,
  `userID` int(11) NOT NULL,
  `tshirtID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userIDz_idx` (`userID`),
  KEY `tshirtIDz_idx` (`tshirtID`),
  CONSTRAINT `tshirtIDz` FOREIGN KEY (`tshirtID`) REFERENCES `tshirts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userIDz` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rankings`
--

LOCK TABLES `rankings` WRITE;
/*!40000 ALTER TABLE `rankings` DISABLE KEYS */;
INSERT INTO `rankings` VALUES (4,4,1,14),(5,3,1,13),(6,4,1,16),(7,3,41,14),(10,3,1,12),(11,4,1,19);
/*!40000 ALTER TABLE `rankings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `rankings_AFTER_INSERT` AFTER INSERT ON `rankings` FOR EACH ROW BEGIN
	UPDATE tshirts 
    SET ranking = (
		SELECT avg(value) 
        FROM rankings 
        WHERE tshirtID = NEW.tshirtID 
	)
    WHERE id = NEW.tshirtID;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `rankings_AFTER_UPDATE` AFTER UPDATE ON `rankings` FOR EACH ROW BEGIN
	UPDATE tshirts 
    SET ranking = (
		SELECT avg(value) 
        FROM rankings 
        WHERE tshirtID = NEW.tshirtID 
	)
    WHERE id = NEW.tshirtID;
	UPDATE tshirts 
    SET ranking = (
		SELECT avg(value) 
        FROM rankings 
        WHERE tshirtID = OLD.tshirtID 
	)
    WHERE id = OLD.tshirtID;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `rankings_AFTER_DELETE` AFTER DELETE ON `rankings` FOR EACH ROW BEGIN
	UPDATE tshirts 
    SET ranking = (
		SELECT avg(value) 
        FROM rankings 
        WHERE tshirtID = OLD.tshirtID 
	)
    WHERE id = OLD.tshirtID;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tshirts`
--

DROP TABLE IF EXISTS `tshirts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tshirts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `image` varchar(45) NOT NULL,
  `html` longtext NOT NULL,
  `shortText` varchar(120) NOT NULL,
  `price` double NOT NULL,
  `ranking` double NOT NULL,
  `userID` int(11) NOT NULL,
  `color` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId_idx` (`userID`),
  FULLTEXT KEY `searchIndex` (`name`,`shortText`),
  CONSTRAINT `userId` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tshirts`
--

LOCK TABLES `tshirts` WRITE;
/*!40000 ALTER TABLE `tshirts` DISABLE KEYS */;
INSERT INTO `tshirts` VALUES (11,'Exa','','    \n      <link rel=\'stylesheet\' type=\'text/css\' href=\'/public/css/edit-style.css\'>\n\n        <div id=\'miniPolygon\' class=\'men-mini\' style=\'background-color: #fc0707;\'>\n\n        </div>\n        <div id=\'clippedDiv\' class=\'men-poly\' style=\'background-color: #fc0707;\'>\n\n        <p style=\'font-size: 78px; color: rgb(0, 0, 0); padding-top: 60px; padding-left: 160px; position: relative; left: -14px; top: -27px;\' class=\'ui-draggable ui-draggable-handle\' contenteditable=\'true\'>РОССИЯ</p></div>\n    ','Best',220,0,1,'rgb(252, 7, 7)'),(12,'Космос','','    \n      <link rel=\'stylesheet\' type=\'text/css\' href=\'/public/css/edit-style.css\'>\n\n        <div id=\'miniPolygon\' class=\'men-mini\' style=\'background-color: #0732f8;\'>\n\n        </div>\n        <div id=\'clippedDiv\' class=\'men-poly\' style=\'background-color: #0732f8;\'>\n\n        <img src=\'/public/uploads/8b49bc80f496a0a57a6cb238193eeb20f1fd5ceaerroeCat.png\' style=\'width: 300px; position: relative; left: 188px; top: 38px;\' class=\'ui-draggable ui-draggable-handle\'></div>\n    ','Новый стить',330,0,1,'rgb(7, 50, 248)'),(13,'Star','','    \n      <link rel=\'stylesheet\' type=\'text/css\' href=\'/public/css/edit-style.css\'>\n\n        <div id=\'miniPolygon\' class=\'women-mini\' style=\'background-color: #00f9ec;\'>\n\n        </div>\n        <div id=\'clippedDiv\' class=\'women-poly\' style=\'background-color: #00f9ec;\'>\n\n        <img src=\'/public/uploads/075776efb4c8a5d7e7de7c9fd86def46b79602aamts.png\' style=\'width: 300px; position: relative; left: 157px; top: 163px;\' class=\'ui-draggable ui-draggable-handle\'><p style=\'font-size: 88px; color: rgb(219, 43, 17); padding-top: 60px; padding-left: 160px; position: relative; left: 29px; top: -351px;\' class=\'ui-draggable ui-draggable-handle\' contenteditable=\'true\'>СССР</p></div>\n    ','Охрененная очень такая майка',280,0,1,'rgb(0, 249, 236)'),(14,'Экзотика','','    \n      <link rel=\'stylesheet\' type=\'text/css\' href=\'/public/css/edit-style.css\'>\n\n        <div id=\'miniPolygon\' class=\'men-mini\' style=\'background-color: #00ff00;\'>\n\n        </div>\n        <div id=\'clippedDiv\' class=\'men-poly\' style=\'background-color: #00ff00;\'>\n\n        <img src=\'/public/uploads/f69408d337499e1f35b5b71fcb9665b4b4451499mts.png\' class=\'ui-draggable ui-draggable-handle\' style=\'width: 300px; position: relative; left: 140px; top: -17px;\'></div>\n    ','Очень неплохо',120,0,1,'rgb(0, 255, 0)'),(16,'Рим','','    \n      <link rel=\'stylesheet\' type=\'text/css\' href=\'/public/css/edit-style.css\'>\n\n        <div id=\'miniPolygon\' class=\'men-mini\' style=\'background-color: #00ff00;\'>\n\n        </div>\n        <div id=\'clippedDiv\' class=\'men-poly\' style=\'background-color: #00ff00;\'>\n\n        <p style=\'font-size: 14px; color: rgb(0, 0, 0); padding-top: 60px; padding-left: 160px; position: relative; left: 40px; top: -30px;\' class=\'ui-draggable ui-draggable-handle\' contenteditable=\'true\'>СССР<br></p><img src=\'/public/uploads/b0b4fa399d0abddd8f35e1c18a8c1176a8d26667brain.png\' style=\'width: 300px; position: relative; left: 142px; top: -20px;\' class=\'ui-draggable ui-draggable-handle\'><p style=\'font-size: 30px; color: rgb(0, 0, 0); padding-top: 60px; padding-left: 160px; position: relative;\' class=\'ui-draggable ui-draggable-handle\' contenteditable=\'true\'>CCCH</p></div>\n    ','Не оч',120,0,1,'rgb(0, 255, 0)'),(19,'Hello','','    \n      <link rel=\'stylesheet\' type=\'text/css\' href=\'/public/css/edit-style.css\'>\n\n        <div id=\'miniPolygon\' class=\'men-mini\' style=\'background-color: #008000;\'>\n\n        </div>\n        <div id=\'clippedDiv\' class=\'men-poly\' style=\'background-color: #008000;\'>\n\n        <img src=\'/public/uploads/06f86b5fe5acabcd3efcaa0fbd413506d35bfaf3like.png\' style=\'width: 300px; position: relative; left: 184px; top: 33px;\' class=\'ui-draggable ui-draggable-handle\'><p style=\'font-size: 14px; color: rgb(0, 0, 0); padding-top: 60px; padding-left: 160px; position: relative; left: 18px; top: -309px;\' class=\'ui-draggable ui-draggable-handle\' contenteditable=\'true\'>&nbsp;Мир, Привет</p><p style=\'font-size: 22px; color: rgb(0, 0, 0); padding-top: 60px; padding-left: 160px; position: relative;\' class=\'ui-draggable ui-draggable-handle\' contenteditable=\'true\'>Привет!!!</p></div>\n    ','Так се',120,0,1,'rgb(0, 128, 0)');
/*!40000 ALTER TABLE `tshirts` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tshirts_AFTER_INSERT` AFTER INSERT ON `tshirts` FOR EACH ROW BEGIN
    SET @quantity := (SELECT COUNT(*) 
	FROM tshirts 
	WHERE userID = NEW.userID);
    IF @quantity = 3 THEN
		INSERT INTO `usermedals` (`userID`, `medalD`)
		VALUES(NEW.userID, 2);
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tshirts_AFTER_DELETE` AFTER DELETE ON `tshirts` FOR EACH ROW BEGIN
    SET @quantity := (SELECT COUNT(*) 
	FROM tshirts 
	WHERE userID = OLD.userID);
    IF @quantity < 3 THEN
		DELETE FROM `usermedals`
		WHERE userID = OLD.userID AND medalD = 2;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tshirttags`
--

DROP TABLE IF EXISTS `tshirttags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tshirttags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tshirtID` int(11) NOT NULL,
  `tagName` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `indexTS_idx` (`tshirtID`),
  FULLTEXT KEY `searchIndex` (`tagName`),
  CONSTRAINT `indexTS` FOREIGN KEY (`tshirtID`) REFERENCES `tshirts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tshirttags`
--

LOCK TABLES `tshirttags` WRITE;
/*!40000 ALTER TABLE `tshirttags` DISABLE KEYS */;
INSERT INTO `tshirttags` VALUES (1,13,'Best'),(2,13,'Hello'),(3,14,'Best'),(4,14,'Любовь'),(5,16,'Hello'),(6,11,'Best'),(7,19,'k'),(8,19,'k'),(9,19,'k'),(10,19,'k'),(11,16,'Hello'),(12,14,'Best'),(13,14,'Любовь'),(14,12,''),(15,11,'Best'),(16,13,'Best'),(17,13,'Hello'),(18,14,'Best'),(19,14,'Любовь'),(20,14,'Best'),(21,14,'Любовь'),(22,14,'qwertyu');
/*!40000 ALTER TABLE `tshirttags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usermedals`
--

DROP TABLE IF EXISTS `usermedals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `usermedals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `medalD` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userIDc_idx` (`userID`),
  KEY `medalIDc_idx` (`medalD`),
  CONSTRAINT `medalIDc` FOREIGN KEY (`medalD`) REFERENCES `medals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userIDc` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usermedals`
--

LOCK TABLES `usermedals` WRITE;
/*!40000 ALTER TABLE `usermedals` DISABLE KEYS */;
INSERT INTO `usermedals` VALUES (5,1,2),(7,41,1),(37,1,1);
/*!40000 ALTER TABLE `usermedals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` int(11) NOT NULL,
  `fullName` varchar(45) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `language` varchar(45) NOT NULL DEFAULT 'RU',
  `theme` varchar(45) NOT NULL DEFAULT 'WHITE',
  `verify` int(11) NOT NULL,
  `token` varchar(120) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'maxtitovitch@mail.ru','123',1,'Титович Максим','1998-11-03','EN','WHITE',1,'0acaa098ef805f5b01100422283b61632b5634d0'),(41,'ivan@mail.ru','1234',0,'Иван Иванов','2007-02-21','EN','BLACK',1,'8846ecc70d29dbfcb148d5fa7b9949b7fd8ac245'),(52,'Atashrahmedov@mail.ru','123',0,'РРР','1999-12-12','RU','WHITE',1,'f1e02cb820329598071e68e6a8312c710b2c2917'),(53,'ivan@maihl.ru','1234',0,'hjh','1998-08-07','RU','WHITE',0,'9ff6186c9abfa1f9a86a4e45e951dc4c38807e7e'),(54,'qwertyu@mail.ru','qwertyu',0,'Таврпп Впрпро','2012-10-16','EN','WHITE',1,'c50fc437a2b948b167be7624b4169db5841dd332');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'metamebelmodern'
--

--
-- Dumping routines for database 'metamebelmodern'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-05-09  0:11:28
