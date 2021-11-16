DROP FUNCTION moderation_reputation;

DELIMITER $$
CREATE DEFINER=`root`@`%` FUNCTION `moderation_reputation`(id INT) RETURNS int
    DETERMINISTIC
RETURN (select(
	(select IF(SUM(u.lvl) > 0, SUM(u.lvl), 0) from 
	User u natural join Opinion o natural join Moderation m
	where o.opinion='positive' and id_moderation=id)
	-
	(select IF(SUM(u.lvl) > 0, SUM(u.lvl), 0) from 
	User u natural join Opinion o natural join Moderation m
	where o.opinion='negative' and id_moderation=id)) as rep)
$$ DELIMITER ;
