CREATE TABLE `Formula` (
  `id_formula` int NOT NULL AUTO_INCREMENT,
  `equation` varchar(240) DEFAULT NULL,
  `txt` text,
  `title` varchar(80) DEFAULT NULL,
  `id_topic` int NOT NULL,
  `rawLatex` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id_formula`),
  KEY `fk_topic_formula` (`id_topic`),
  CONSTRAINT `Formula_ibfk_1` FOREIGN KEY (`id_topic`) REFERENCES `Topic` (`id_topic`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Topic` (
  `id_topic` int NOT NULL AUTO_INCREMENT,
  `id_category` int DEFAULT NULL,
  `txt` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id_topic`),
  UNIQUE KEY `topic_category` (`id_category`,`txt`),
  UNIQUE KEY `onlyTopicPerCategory` (`id_category`,`txt`),
  CONSTRAINT `fk_category_topic` FOREIGN KEY (`id_category`) REFERENCES `Category` (`id_category`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Category` (
  `id_category` int NOT NULL AUTO_INCREMENT,
  `txt` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id_category`),
  UNIQUE KEY `txt` (`txt`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Cheatsheet` (
  `id_cheatsheet` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `title` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id_cheatsheet`),
  KEY `fk_user_cheatsheet` (`id_user`),
  CONSTRAINT `fk_user_cheatsheet` FOREIGN KEY (`id_user`) REFERENCES `User` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `CheatsheetContent` (
  `id_cheatsheetcontent` int NOT NULL AUTO_INCREMENT,
  `id_cheatsheet` int NOT NULL,
  `id_formula` int NOT NULL,
  PRIMARY KEY (`id_cheatsheetcontent`),
  KEY `fk_formula_cheatsheetcontent` (`id_formula`),
  KEY `fk_cheatsheet_cheatsheetcontent` (`id_cheatsheet`),
  CONSTRAINT `fk_cheatsheet_cheatsheetcontent` FOREIGN KEY (`id_cheatsheet`) REFERENCES `Cheatsheet` (`id_cheatsheet`) ON DELETE CASCADE,
  CONSTRAINT `fk_equation_cheatsheetcontent` FOREIGN KEY (`id_formula`) REFERENCES `Formula` (`id_formula`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `User` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `username` varchar(60) DEFAULT NULL,
  `firstname` varchar(60) DEFAULT NULL,
  `lastname` varchar(60) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `reputation` int DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Permission` (
  `id_permission` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_cheatsheet` int NOT NULL,
  `permission` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`id_permission`),
  KEY `fk_user_permission` (`id_user`),
  KEY `fk_cheatsheet_permission` (`id_cheatsheet`),
  CONSTRAINT `fk_cheatsheet_permission` FOREIGN KEY (`id_cheatsheet`) REFERENCES `Cheatsheet` (`id_cheatsheet`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_permission` FOREIGN KEY (`id_user`) REFERENCES `User` (`id_user`) ON DELETE CASCADE,
  CONSTRAINT `Permission_chk_1` CHECK (((`permission` = _utf8mb4'r') or (`permission` = _utf8mb4'w')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
