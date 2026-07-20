const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "../database.db"));

try {
    db.prepare("SELECT 1").get();
    console.log("SQLite connected successfully.");
} catch (error) {
    console.error("SQLite connection failed:", error.message);
    process.exit(1);
}

module.exports = db;