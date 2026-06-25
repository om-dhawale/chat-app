DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    sender_id INT REFERENCES users(id),
    room_id INT REFERENCES rooms(id),
    created_at TIMESTAMP DEFAULT NOW()
);