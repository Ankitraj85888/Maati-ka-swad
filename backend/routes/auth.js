'use strict';

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../database');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = (await db.query('SELECT id FROM users WHERE email = $1', [email])).rows[0];
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = bcrypt.hashSync(password, 10);
    const result = (await db.query(
      'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, role, created_at',
      [name, email, hashed, phone || '']
    )).rows[0];

    const token = jwt.sign(
      { id: result.id, name, email, role: 'customer' },
      JWT_SECRET, { expiresIn: '30d' }
    );

    res.status(201).json({ token, user: result, message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = (await db.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET, { expiresIn: '30d' }
    );

    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser, message: `Welcome back, ${user.name}!` });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = (await db.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1', [req.user.id])).rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.put('/change-password', requireAuth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password)
      return res.status(400).json({ error: 'Both current and new password required' });

    const user = (await db.query('SELECT * FROM users WHERE id = $1', [req.user.id])).rows[0];
    if (!bcrypt.compareSync(current_password, user.password))
      return res.status(401).json({ error: 'Current password is incorrect' });

    if (new_password.length < 6)
      return res.status(400).json({ error: 'New password must be at least 6 characters' });

    await db.query('UPDATE users SET password = $1 WHERE id = $2', [bcrypt.hashSync(new_password, 10), req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;
