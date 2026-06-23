'use strict';

const express = require('express');
const db      = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: 'Name, email and message are required' });

    await db.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1,$2,$3,$4,$5)',
      [name, email, phone || '', subject || 'General Query', message]
    );

    res.status(201).json({ message: 'Your message has been sent! We\'ll reply within 24 hours. 🙏' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM contact_messages';
    const args = [];
    if (status) { sql += ' WHERE status = $1'; args.push(status); }
    sql += ' ORDER BY created_at DESC';

    const { rows } = await db.query(sql, args.length ? args : undefined);
    const unread = (await db.query("SELECT COUNT(*) as c FROM contact_messages WHERE status = 'unread'")).rows[0].c;
    res.json({ messages: rows, unread: parseInt(unread) });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['unread','read','replied'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const msg = (await db.query('SELECT id FROM contact_messages WHERE id = $1', [req.params.id])).rows[0];
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    await db.query('UPDATE contact_messages SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ message: 'Message status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const msg = (await db.query('SELECT id FROM contact_messages WHERE id = $1', [req.params.id])).rows[0];
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    await db.query('DELETE FROM contact_messages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;
