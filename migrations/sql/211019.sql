alter table Moderation drop constraint `chkStateModeration`;
alter table Moderation rename column state to action;
alter table Moderation add constraint `chkActionModeration` CHECK (action in ('add', 'remove'));
alter table Opinion drop constraint `chkStateOpinion`;
alter table Opinion drop column state;
create table ModerationResult (
	id_moderationresult int not null auto_increment primary key,
    id_moderation int not null,
    state varchar(32),
    constraint chkStateModerationResult check (state in ('stand by', 'added', 'removed')),
    constraint fk_moderation_moderation foreign key (id_moderation) references Moderation(id_moderation)
);
create function moderation_reputation(id INT)
    RETURNS int deterministic
    RETURN (select 
		(select SUM(u.lvl) as subs from 
			User u natural join Opinion o natural join Moderation m
			where o.opinion='positive' and id_moderation=id)
		- (select SUM(u.lvl) as subs from 
			User u natural join Opinion o natural join Moderation m
			where o.opinion='negative' and id_moderation=id));
