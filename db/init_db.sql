drop schema if exists weatherwear cascade;

create schema weatherwear;

create table weatherwear.user (
    id int8 not null primary key,
    username text not null
);

create table weatherwear.outfit (
    id serial not null primary key,
    image bytea not null,
    user_id int8 default -1 not null
);