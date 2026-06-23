'use strict';

const express = require('express');
const db      = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const totalRevenue   = (await db.query("SELECT COALESCE(SUM(total),0) as v FROM orders WHERE status != 'cancelled'")).rows[0].v;
    const totalOrders    = (await db.query('SELECT COUNT(*) as v FROM orders')).rows[0].v;
    const totalCustomers = (await db.query("SELECT COUNT(*) as v FROM users WHERE role = 'customer'")).rows[0].v;
    const totalProducts  = (await db.query('SELECT COUNT(*) as v FROM products WHERE is_active = 1')).rows[0].v;
    const lowStock       = (await db.query('SELECT COUNT(*) as v FROM products WHERE stock < 10 AND is_active = 1')).rows[0].v;
    const pendingOrders  = (await db.query("SELECT COUNT(*) as v FROM orders WHERE status = 'pending'")).rows[0].v;
    const unreadMessages = (await db.query("SELECT COUNT(*) as v FROM contact_messages WHERE status = 'unread'")).rows[0].v;

    const revenueByCategory = (await db.query(`
      SELECT p.category, COALESCE(SUM(oi.price * oi.qty), 0) as revenue
      FROM order_items oi JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled' GROUP BY p.category
    `)).rows;

    const ordersByStatus = (await db.query(`
      SELECT status, COUNT(*)::int as count FROM orders GROUP BY status
    `)).rows;

    const weeklyRevenue = (await db.query(`
      SELECT DATE(created_at) as day, SUM(total) as revenue
      FROM orders WHERE created_at >= NOW() - INTERVAL '7 days' AND status != 'cancelled'
      GROUP BY DATE(created_at) ORDER BY day ASC
    `)).rows;

    const topProducts = (await db.query(`
      SELECT p.name, p.emoji, SUM(oi.qty)::int as qty_sold, SUM(oi.price * oi.qty) as revenue
      FROM order_items oi JOIN products p ON oi.product_id = p.id
      GROUP BY p.id ORDER BY qty_sold DESC LIMIT 5
    `)).rows;

    res.json({
      stats: { totalRevenue: parseFloat(totalRevenue), totalOrders: parseInt(totalOrders), totalCustomers: parseInt(totalCustomers), totalProducts: parseInt(totalProducts), lowStock: parseInt(lowStock), pendingOrders: parseInt(pendingOrders), unreadMessages: parseInt(unreadMessages) },
      revenueByCategory,
      ordersByStatus,
      weeklyRevenue,
      topProducts
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
        COUNT(o.id)::int as order_count,
        COALESCE(SUM(o.total),0) as total_spent
      FROM users u LEFT JOIN orders o ON o.user_id = u.id
      GROUP BY u.id ORDER BY u.created_at DESC
    `);
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, per_page = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(per_page);
    let sql = 'SELECT * FROM orders';
    const args = [];
    let idx = 1;
    if (status) { sql += ` WHERE status = $${idx++}`; args.push(status); }
    sql += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    args.push(parseInt(per_page), offset);

    const { rows: orders } = await db.query(sql, args);
    const total = (await db.query('SELECT COUNT(*) as c FROM orders' + (status ? ` WHERE status = $1` : ''), status ? [status] : [])).rows[0].c;

    const enriched = [];
    for (const o of orders) {
      const { rows: items } = await db.query('SELECT * FROM order_items WHERE order_id = $1', [o.id]);
      enriched.push({ ...o, items });
    }

    res.json({ orders: enriched, total: parseInt(total), page: parseInt(page), per_page: parseInt(per_page), total_pages: Math.ceil(total / per_page) });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

module.exports = router;
