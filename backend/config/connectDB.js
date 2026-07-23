const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

let dbPath = path.join(__dirname, "../database.db");

if (process.env.VERCEL) {
    const tmpPath = path.join("/tmp", "database.db");
    
    if (!fs.existsSync(tmpPath)) {
        if (fs.existsSync(dbPath)) {
            fs.copyFileSync(dbPath, tmpPath);
        } else {
            fs.writeFileSync(tmpPath, "");
        }
    }
    
    dbPath = tmpPath;
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
try {
    db.prepare("SELECT 1").get();
    console.log("SQLite connected successfully.");
} catch (error) {
    console.error("SQLite connection failed:", error.message);
    process.exit(1);
}

module.exports = db;