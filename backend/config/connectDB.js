const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

let dbPath = path.join(__dirname, "../database.db");

if (process.env.VERCEL) {
    const tmpPath = path.join("/tmp", "database.db");
    
    if (!fs.existsSync(tmpPath)) {
        fs.copyFileSync(dbPath, tmpPath);
    }
    
    dbPath = tmpPath;
}

const db = new Database(dbPath);

try {
    db.prepare("SELECT 1").get();
    console.log("SQLite connected successfully.");
} catch (error) {
    console.error("SQLite connection failed:", error.message);
    process.exit(1);
}

module.exports = db;