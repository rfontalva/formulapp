DELIMITER $$
CREATE FUNCTION calc_user_lvl (id INT)
RETURNS INTEGER
DETERMINISTIC
	BEGIN
    DECLARE temp INT;
	SET temp=(select count(*) FROM Opinion o
		join Moderation using (id_moderation) join User u2 using (id_user)
		where state="removed" and opinion="negative" and id_user=id)
    +
		(select count(*) FROM Opinion o
		join Moderation using (id_moderation) join User u2 using (id_user)
		where state="added" and opinion="positive" and id_user=id)
	-
		(select count(*) FROM Opinion o
		join Moderation using (id_moderation) join User u2 using (id_user)
		where state="added" and opinion="negative" and id_user=id)
    -
		(select count(*) FROM Opinion o
		join Moderation using (id_moderation) join User u2 using (id_user)
		where state="removed" and opinion="positive" and id_user=id);
	RETURN (SELECT IF(floor(temp/10) > 3, 3, IF(floor(temp/10) = 0, 1,floor(temp/10) = 0)));
END $$

CREATE TABLE Edition (
  id_edition int not null auto_increment,
  id_formula int NOT NULL,
  equation varchar(240) DEFAULT NULL,
  txt text,
  title varchar(80) DEFAULT NULL,
  id_topic int NOT NULL,
  rawLatex bool DEFAULT NULL,
  PRIMARY KEY (id_edition),
  constraint fk_formula_edition foreign key (id_formula) references Formula(id_formula) on delete cascade
);

alter table Moderation drop constraint chkActionModeration;
alter table Moderation modify column action enum('add','remove','edit');
alter table Formula modify column state enum('stand by','added','removed', 'edited');
