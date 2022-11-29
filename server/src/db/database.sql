CREATE DATABASE matcha;

CREATE TABLE users(
    users_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);