/*
 This is the schema used to create the production CockroachDB Database
 */
CREATE TABLE weatherwear.outfit (
    id INT8 NOT NULL DEFAULT unique_rowid(),
    image_category STRING NOT NULL,
    feet_id INT8 NOT NULL,
    head_id INT8 NOT NULL,
    legs_id INT8 NOT NULL,
    torso_id INT8 NOT NULL,
    user_id STRING NULL,
    time_created TIMESTAMP NULL DEFAULT now() :: :TIMESTAMP,
    CONSTRAINT outfit_pkey PRIMARY KEY (id ASC)
);