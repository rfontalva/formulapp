create table Moderation(
	id_moderation int not null AUTO_INCREMENT primary key,
  id_formula int not null,
  state varchar(32),
	constraint chkStateModeration CHECK (state in ('add','remove')),
  foreign key fk_formula_moderation (id_formula) references
		Formula(id_formula) on delete cascade on update cascade
);

create table Opinion(
	id_opinion int not null AUTO_INCREMENT primary key,
	id_moderation int not null,
  id_user int not null,
  opinion varchar(32),
  state varchar(32),
  constraint chkOpinion CHECK (opinion in ('positive','negative')),
  constraint chkStateOpinion CHECK (state in ('stand by','approved', 'rejected')),
  foreign key fk_user_opinion (id_user) references
    User(id_user),
	foreign key fk_moderation_opinion (id_moderation) references
		Moderation(id_moderation)
);

alter table User drop column reputation;
alter table User add column lvl int default 1;
alter table Cheatsheet drop constraint fk_user_cheatsheet;
alter table Cheatsheet drop column id_user;
alter table Cheatsheet add column public bool;
alter table Cheatsheet alter column public set default false;
alter table Permission add constraint chkPermission check (permission in ('a','r','w'));
alter table Permission alter column permission set default 'a';
alter table Permission drop constraint Permission_chk_1
