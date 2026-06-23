'use strict';

const express = require('express');
const db      = require('../database');
const { requireAuth, optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { user_name, user_email, user_phone, address, city, state, pincode, payment_method, items, subtotal, shipping, discount, total, notes } = req.body;

    if (!user_name || !user_email || !items || !items.length || !total)
      return res.status(400).json({ error: 'Missing required order fields' });

    for (const item of items) {
      const { rows } = await db.query('SELECT * FROM products WHERE id = $1 AND is_active = 1', [item.product_id]);
      const product = rows[0];
      if (!product) return res.status(400).json({ error: `Product ID ${item.product_id} not found` });
      if (product.stock < item.qty) return res.status(400).json({ error: `Insufficient stock for "${product.name}"` });
    }

    const orderNumber = 'SS-' + Date.now().toString(36).toUpperCase().slice(-6);

    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const orderResult = await client.query(
        `INSERT INTO orders (order_number, user_id, user_name, user_email, user_phone, address, city, state, pincode, payment_method, subtotal, shipping, discount, total, status, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'pending',$15) RETURNING id`,
        [orderNumber, req.user?.id || null, user_name, user_email, user_phone || '',
         address || '', city || '', state || '', pincode || '',
         payment_method || 'cod', subtotal || 0, shipping || 0, discount || 0, total, notes || '']
      );
      const orderId = orderResult.rows[0].id;

      for (const item of items) {
        const product = (await client.query('SELECT name, price FROM products WHERE id = $1', [item.product_id])).rows[0];
        await client.query(
          'INSERT INTO order_items (order_id, product_id, product_name, price, qty) VALUES ($1,$2,$3,$4,$5)',
          [orderId, item.product_id, product.name, item.price, item.qty]
        );
        await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.qty, item.product_id]);
      }

      await client.query('COMMIT');

      const order = await getFullOrder(orderId);
      res.status(201).json({ order, message: 'Order placed successfully!', order_number: orderNumber });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let sql    = 'SELECT * FROM orders';
    const args = [];
    let idx = 1;
    if (status) { sql += ` WHERE status = $${idx++}`; args.push(status); }
    sql += ' ORDER BY created_at DESC LIMIT $' + (idx++) + ' OFFSET $' + (idx++);
    args.push(parseInt(limit), parseInt(offset));

    const { rows } = await db.query(sql, args);
    const total  = (await db.query('SELECT COUNT(*) as c FROM orders' + (status ? ` WHERE status = $1` : ''), status ? [status] : [])).rows[0].c;
    res.json({ orders: rows, total: parseInt(total) });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/my', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT o.*, STRING_AGG(oi.product_name || ' x' || oi.qty, ', ') as items_summary
       FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders: rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const order = await getFullOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (req.user && (req.user.role === 'admin' || order.user_id === req.user.id)) {
      return res.json({ order });
    }
    return res.json({ order: { id: order.id, order_number: order.order_number, status: order.status, total: order.total, created_at: order.created_at } });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending','confirmed','processing','shipped','delivered','cancelled'];
    if (!valid.includes(status))
      return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });

    const order = (await db.query('SELECT id FROM orders WHERE id = $1', [req.params.id])).rows[0];
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ message: 'Order status updated', status });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

async function getFullOrder(id) {
  const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
  if (!rows[0]) return null;
  const { rows: items } = await db.query(
    `SELECT oi.*, p.emoji, p.color FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`, [id]
  );
  return { ...rows[0], items };
}

module.exports = router;
