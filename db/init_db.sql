/*
 This is the DLL used to create the production CockroachDB Weatherwear Database. All tables are inside of schema weatherwear
 */
drop schema if exists weatherwear cascade;

create schema weatherwear;

CREATE TABLE weatherwear.outfit (
    id INT8 NOT NULL DEFAULT unique_rowid(),
    image_category STRING NOT NULL,
    feet_id INT8 NOT NULL,
    head_id INT8 NOT NULL,
    legs_id INT8 NOT NULL,
    torso_id INT8 NOT NULL,
    user_id STRING NULL,
    time_created TIMESTAMP NULL DEFAULT now(),
    CONSTRAINT outfit_pkey PRIMARY KEY (id ASC)
);

CREATE TABLE weatherwear.saved_city (
    city_name STRING NOT NULL,
    lat DECIMAL NOT NULL,
    lon DECIMAL NOT NULL,
    user_id DECIMAL NOT NULL,
    rowid INT8 NOT VISIBLE NOT NULL DEFAULT unique_rowid(),
    CONSTRAINT saved_city_pkey PRIMARY KEY (rowid ASC)
);