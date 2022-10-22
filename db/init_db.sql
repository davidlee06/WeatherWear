drop schema if exists weatherwear cascade;

create schema weatherwear;

create table weatherwear.outfit (
    id serial not null primary key,
    image bytea not null,
    user_id text not null,
    time_created timestamp default now()
);