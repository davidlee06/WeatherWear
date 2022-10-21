drop schema if exists weatherwear cascade;

create schema weatherwear;

create table weatherwear.user (
    id int8 not null primary key,
    username text not null
);

create table weatherwear.outfit (
    id serial not null primary key,
    image bytea not null,
    user_id text default "N/A" not null,
    time_created timestamp default now()
);