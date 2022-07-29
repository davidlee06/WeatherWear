create schema weatherwear;

create table weatherwear."user"
(
    id              text  not null,
    user_name       text  not null,
    profile_picture bytea not null
);

create table weatherwear.outfit
(
    user_id      text    not null,
    outfit_image integer not null,
    date_created integer not null
);

create table weatherwear.location
(
    city       integer not null,
    state_code integer not null,
    user_id    text    not null
);