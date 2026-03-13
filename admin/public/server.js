// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('admin_dashboard.db');

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    role TEXT
  )`);
  // Add more tables as needed
});

// API: Get all admins
app.get('/api/admins', (req, res) => {
  db.all('SELECT * FROM admins', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Add new admin
app.post('/api/admins', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO admins (username, password) VALUES (?, ?)`, [username, password], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, username, password });
  });
});

// API: Update admin credentials
app.put('/api/admins/:id', (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  db.run(`UPDATE admins SET username = ?, password = ? WHERE id = ?`, [username, password, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Updated successfully' });
  });
});

// API: Get users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Add user
app.post('/api/users', (req, res) => {
  const { email, role } = req.body;
  db.run(`INSERT INTO users (email, role) VALUES (?, ?)`, [email, role], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, email, role });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});