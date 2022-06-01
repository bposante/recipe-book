drop table if exists recipes;
create table recipes(
    recipe_id int(11) not null auto_increment,
    spoon_id varchar(36),
    recipe_name varchar(100) not null,
    instructions varchar(10000),
    make_time int(11),
    favorite boolean not null default 0,
    servings int(11),
    times_made int(11),
    description varchar(500),
    primary key (recipe_id),
    constraint unique_name unique (recipe_name)
);

drop table if exists ingredients;
create table ingredients(
    ing_id int(11) not null auto_increment,
    ing_name varchar(255) not null,
    primary key (ing_id),
    constraint unique_ing_name unique (ing_name)
);

drop table if exists quantities;
create table quantities(
    q_id int(11) not null auto_increment,
    quantity varchar(255) not null,
    primary key (q_id),
    constraint unique_quantity unique (quantity)
);

drop table if exists recipe_ingredients;
create table recipe_ingredients(
    ring_id int(11) not null auto_increment,
    recipe_id int(11) not null,
    ing_id int(11) not null,
    q_id int(11) not null,
    primary key (ring_id),
    constraint fk_ri_recipe foreign key (recipe_id) references recipes (recipe_id) on update cascade on delete cascade,
    constraint fk_ri_ing foreign key (ing_id) references ingredients (ing_id) on update cascade on delete cascade,
    constraint fk_ri_q foreign key (q_id) references quantities (q_id) on update cascade on delete cascade
);