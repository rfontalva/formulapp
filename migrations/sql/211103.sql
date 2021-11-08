alter table Formula add column state ENUM('stand by', 'added', 'removed') default 'stand by';
update Formula set state='added';
alter table Formula add column id_user int not null;
update Formula set id_user=(select id_user from User where username='admin');
alter table Formula add constraint fk_user_formula foreign key (id_user) references User(id_user);
drop table ModerationResult;
alter table Moderation add column state ENUM('started', 'approved', 'rejected') default 'started';
drop view eq_search;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `eq_search` AS select `f`.`id_formula` AS `id_formula`,`tp`.`id_topic` AS `id_topic`,`c`.`id_category` AS `id_category`,`f`.`title` AS `title`,`f`.`txt` AS `description`,`f`.`rawLatex` AS `rawLatex`,`f`.`equation` AS `equation`,`c`.`txt` AS `category`,`tp`.`txt` AS `topic` from ((`Formula` `f` join `Topic` `tp` on((`tp`.`id_topic` = `f`.`id_topic`))) join `Category` `c` on((`c`.`id_category` = `tp`.`id_category`))) where (`f`.`state` not in ('stand by','removed'));
