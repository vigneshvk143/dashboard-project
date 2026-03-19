const Database = require('better-sqlite3');
const path = require('path');

// SQLite file will be created at backend/database.sqlite
const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Create Tables ──────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS customer_orders (
    id          TEXT PRIMARY KEY,
    firstName   TEXT NOT NULL,
    lastName    TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    address     TEXT,
    city        TEXT,
    state       TEXT,
    postalCode  TEXT,
    country     TEXT DEFAULT 'US',
    product     TEXT NOT NULL,
    quantity    INTEGER NOT NULL DEFAULT 1,
    unitPrice   REAL NOT NULL DEFAULT 0,
    totalAmount REAL NOT NULL DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'pending'
                  CHECK(status IN ('pending','processing','shipped','delivered','cancelled')),
    createdBy   TEXT DEFAULT 'demo',
    createdAt   TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt   TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS dashboard_layouts (
    id        TEXT PRIMARY KEY,
    userId    TEXT NOT NULL UNIQUE,
    name      TEXT DEFAULT 'My Dashboard',
    widgets   TEXT NOT NULL DEFAULT '[]',   -- JSON string
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

console.log('✅ SQLite connected:', DB_PATH);

module.exports = db;
