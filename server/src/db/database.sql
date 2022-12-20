CREATE DATABASE matcha;

CREATE TABLE test_users (
    users_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
	id SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	last_connection TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (pending make columns not null )