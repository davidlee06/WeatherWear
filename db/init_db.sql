create schema "weatherwear";

create table weatherwear.outfit_piece (
    id serial primary key,
    x integer not null,
    y integer not null,
    data bytea not null,
    body_part text not null,
    temp_range text not null
);

create table weatherwear."user" (
    id text not null primary key,
    user_name text not null,
    profile_picture bytea not null
);

create table weatherwear.location (
    id integer not null primary key,
    city text not null,
    state_code text not null,
    user_id text not null,
    constraint fk_user_id foreign key (user_id) references weatherwear."user" (id)
);

create table weatherwear.outfit (
    id integer not null primary key,
    user_id text not null,
    data bytea not null,
    time_generated integer not null,
    constraint fk_user_id foreign key (user_id) references weatherwear."user" (id)
);