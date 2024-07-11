// server.js

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// SQLite database connection
const db = new sqlite3.Database('exam.db');

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS invigilator_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_name TEXT,
    students_attended INTEGER,
    log_issues TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Endpoint to save invigilator information
app.post('/save-info', (req, res) => {
    const { moduleName, studentsAttended, logIssues } = req.body;

    db.run(`INSERT INTO invigilator_info (module_name, students_attended, log_issues) VALUES (?, ?, ?)`,
        [moduleName, studentsAttended, logIssues], function (err) {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Information saved successfully!' });
        });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

