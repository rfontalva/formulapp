Drop table `ModerationResult`;
CREATE TABLE `ModerationResult` (
  `id_moderationresult` int NOT NULL AUTO_INCREMENT,
  `id_moderation` int NOT NULL,
  `state` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id_moderationresult`),
  KEY `fk_moderation_moderation` (`id_moderation`),
  CONSTRAINT `fk_moderation_moderation` FOREIGN KEY (`id_moderation`) REFERENCES `Moderation` (`id_moderation`),
  CONSTRAINT `chkStateModerationResult` CHECK ((`state` in (_utf8mb4'stand by',_utf8mb4'approved',_utf8mb4'rejected')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `eq_search` AS select `f`.`id_formula` AS `id_formula`,`tp`.`id_topic` AS `id_topic`,`c`.`id_category` AS `id_category`,`f`.`title` AS `title`,`f`.`txt` AS `description`,`f`.`rawLatex` AS `rawLatex`,`f`.`equation` AS `equation`,`c`.`txt` AS `category`,`tp`.`txt` AS `topic` from ((`Formula` `f` join `Topic` `tp` on((`tp`.`id_topic` = `f`.`id_topic`))) join `Category` `c` on((`c`.`id_category` = `tp`.`id_category`))) where `f`.`id_formula` in (select `Moderation`.`id_formula` from (`Moderation` join `ModerationResult`) where (`ModerationResult`.`state` in ('stand by','rejected'))) is false;
