// =====================================================
// MAATI KA SWAD — Express Backend Server
// =====================================================
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express    = require('express');
const cors       = require('cors');

const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes   = require('./routes/orders');
const contactRoutes = require('./routes/contact');
const adminRoutes   = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Allowed origins ───────────────────────────────────
// Add your Vercel/Netlify frontend URL here after deploying the frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  // Add your production frontend URL below when ready:
  // 'https://your-frontend.vercel.app'
  /\.vercel\.app$/,
  /\.netlify\.app$/,
  /\.onrender\.com$/,
];

// ── Middleware ────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) callback(null, true);
    else callback(new Error(`CORS: ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);
  next();
});

// ── API Routes ────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/admin',    adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Maati Ka Swad API is running 🍶',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Maati Ka Swad API',
    version: '1.0.0',
    health: '/api/health',
    docs: 'Endpoints: /api/products, /api/auth, /api/orders'
  });
});

// ── 404 handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ── Error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ── Start ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════');
  console.log('  🍶  MAATI KA SWAD BACKEND API  🍶');
  console.log('═══════════════════════════════════════════');
  console.log(`  API:    http://localhost:${PORT}/api`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log('═══════════════════════════════════════════\n');
});

module.exports = app;
