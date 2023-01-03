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

CREATE TABLE IF NOT EXISTS user_settings (
  running_id SERIAL NOT NULL PRIMARY KEY,
  user_id INT NOT NULL,
  gender VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  sexual_pref VARCHAR(255) NOT NULL,
  biography VARCHAR(65535) NOT NULL,
  fame_rating INT NOT NULL DEFAULT 0,
  user_location VARCHAR(255) NOT NULL,
  IP_location POINT NOT NULL
)

-- (pending make columns not null )