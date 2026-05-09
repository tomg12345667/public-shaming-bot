const Database = require("better-sqlite3");

const db = new Database("logs.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    moderator TEXT,
    target TEXT,
    reason TEXT,
    message_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

module.exports = db;
