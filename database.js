const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('exam.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS invigilator_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_name TEXT,
        students_attended INTEGER,
        log_issues TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;
