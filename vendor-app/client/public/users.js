// pages/api/admin.js
import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('mainpage.db');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    db.all('SELECT * FROM admins', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(rows);
    });
  } else if (req.method === 'POST') {
    const { username, password } = req.body;
    db.run(`INSERT INTO admins (username, password) VALUES (?, ?)`, [username, password], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ id: this.lastID, username, password });
    });
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { username, password } = req.body;
    db.run(`UPDATE admins SET username = ?, password = ? WHERE id = ?`, [username, password, id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Updated successfully' });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}