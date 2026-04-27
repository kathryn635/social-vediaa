import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await open({
  filename: path.join(__dirname, 'social.db'),
  driver: sqlite3.Database
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT,
    coverPic TEXT,
    profilePic TEXT,
    city TEXT,
    website TEXT,
    token TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    \`desc\` TEXT,
    img TEXT,
    userId INTEGER NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    \`desc\` TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    userId INTEGER NOT NULL,
    postId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (postId) REFERENCES posts(id)
  );

  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    postId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (postId) REFERENCES posts(id)
  );

  CREATE TABLE IF NOT EXISTS relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    followerUserId INTEGER NOT NULL,
    followedUserId INTEGER NOT NULL,
    FOREIGN KEY (followerUserId) REFERENCES users(id),
    FOREIGN KEY (followedUserId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    img TEXT,
    userId INTEGER NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

export default db;