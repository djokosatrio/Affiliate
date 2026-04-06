require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
// CORS harus di atas semua route
app.use(cors({ origin: "*" }));

// =====================
// DATABASE CONNECTION
// =====================
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// =====================
// ROOT TEST
// =====================
app.get('/', (req, res) => {
  res.send('API jalan');
});

// =====================
// GET PRODUCTS
// support:
// ?search=
// ?category=
// ?page=
// =====================
app.get('/products', async (req, res) => {
  try {
    const { search = '', category = '', page = 1 } = req.query;

    const limit = 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM products
      WHERE 1=1
    `;

    let params = [];
    let i = 1;

    // search
    if (search) {
      query += ` AND title ILIKE $${i}`;
      params.push(`%${search}%`);
      i++;
    }

    // filter category
    if (category) {
      query += ` AND category = $${i}`;
      params.push(category);
      i++;
    }

    // pagination
    query += ` ORDER BY id DESC LIMIT $${i} OFFSET $${i + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// =====================
// REDIRECT AFFILIATE
// =====================
app.get('/go/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT affiliate_url FROM products WHERE id=$1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Produk tidak ditemukan');
    }

    res.redirect(result.rows[0].affiliate_url);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error redirect');
  }
});

// =====================
// OPTIONAL: ADD PRODUCT (ADMIN)
// =====================
app.post('/products', async (req, res) => {
  try {
    const { title, price, image, affiliate_url, category } = req.body;

    const result = await db.query(
      `INSERT INTO products (title, price, image, affiliate_url, category)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [title, price, image, affiliate_url, category]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert gagal' });
  }
});

// =====================
// START SERVER
// =====================
app.listen(3001, () => {
  console.log('Backend jalan di http://localhost:3001');
});

