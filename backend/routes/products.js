'use strict';

const express = require('express');
const db      = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { cat, search, badge, sort, limit } = req.query;
    let sql    = 'SELECT * FROM products WHERE is_active = 1';
    const args = [];
    let idx = 1;

    if (cat && cat !== 'all') { sql += ` AND category = $${idx++}`; args.push(cat); }
    if (badge)                { sql += ` AND badge = $${idx++}`;    args.push(badge); }
    if (search) {
      sql += ` AND (name ILIKE $${idx} OR name_hi ILIKE $${idx} OR category ILIKE $${idx})`;
      args.push(`%${search}%`);
      idx++;
    }

    switch (sort) {
      case 'price-asc':  sql += ' ORDER BY price ASC';    break;
      case 'price-desc': sql += ' ORDER BY price DESC';   break;
      case 'rating':     sql += ' ORDER BY rating DESC';  break;
      case 'new':        sql += ' ORDER BY id DESC';      break;
      default:           sql += ' ORDER BY id ASC';
    }

    if (limit) { sql += ` LIMIT $${idx}`; args.push(parseInt(limit)); }

    const { rows } = await db.query(sql, args);
    const parsed   = rows.map(parseProduct);
    res.json({ products: parsed, count: parsed.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1 AND is_active = 1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: parseProduct(rows[0]) });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, name_hi, category, price, mrp, weight, stock, badge, emoji, color, description, ingredients } = req.body;
    if (!name || !category || !price || !mrp)
      return res.status(400).json({ error: 'name, category, price, mrp are required' });

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const { rows } = await db.query(
      `INSERT INTO products (name, name_hi, slug, category, price, mrp, weight, stock, badge, emoji, color, description, ingredients)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [name, name_hi||'', slug, category, price, mrp, weight||'250g', stock||50, badge||'', emoji||'🍴', color||'#D4620A', description||'', JSON.stringify(ingredients||[])]
    );

    res.status(201).json({ product: parseProduct(rows[0]), message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, name_hi, category, price, mrp, weight, stock, badge, emoji, color, description, ingredients, is_active } = req.body;
    const existing = (await db.query('SELECT id FROM products WHERE id = $1', [req.params.id])).rows[0];
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const { rows } = await db.query(
      `UPDATE products SET
        name=COALESCE($1,name), name_hi=COALESCE($2,name_hi), category=COALESCE($3,category),
        price=COALESCE($4,price), mrp=COALESCE($5,mrp), weight=COALESCE($6,weight),
        stock=COALESCE($7,stock), badge=COALESCE($8,badge), emoji=COALESCE($9,emoji),
        color=COALESCE($10,color), description=COALESCE($11,description),
        ingredients=COALESCE($12,ingredients), is_active=COALESCE($13,is_active)
       WHERE id = $14 RETURNING *`,
      [name, name_hi, category, price, mrp, weight, stock, badge, emoji, color, description,
       ingredients ? JSON.stringify(ingredients) : null, is_active, req.params.id]
    );

    res.json({ product: parseProduct(rows[0]), message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const existing = (await db.query('SELECT id FROM products WHERE id = $1', [req.params.id])).rows[0];
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    await db.query('UPDATE products SET is_active = 0 WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.patch('/:id/stock', requireAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined) return res.status(400).json({ error: 'stock is required' });
    await db.query('UPDATE products SET stock = $1 WHERE id = $2', [stock, req.params.id]);
    res.json({ message: 'Stock updated', stock });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

function parseProduct(p) {
  return {
    ...p,
    ingredients: safeJson(p.ingredients, []),
    images:      safeJson(p.images,      []),
    is_active:   Boolean(p.is_active)
  };
}

function safeJson(str, fallback) {
  try { return JSON.parse(str || '[]'); } catch { return fallback; }
}

module.exports = router;
