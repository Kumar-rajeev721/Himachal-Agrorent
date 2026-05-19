const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// ── Startup validation ──────────────────────────────────────────────────────
const missingVars = ['MONGO_URI', 'JWT_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'].filter(
  (v) => !process.env[v] || process.env[v].includes('XXXX')
);
if (missingVars.length > 0) {
  console.warn('\n⚠️  Missing or placeholder environment variables:', missingVars.join(', '));
  console.warn('👉  Create backend/.env with your real values. Razorpay features will be disabled.\n');
  // Don't exit — let the server start; only payment routes will fail
}
// ───────────────────────────────────────────────────────────────────────────

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lands', require('./routes/lands'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/seasons', require('./routes/seasons'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/GenAi'));
app.use('/api/payment', require('./routes/payment'));


// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Himachal Agrorent API running', status: 'OK' });
});

const startServer = async () => {
  await connectDB();

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Himachal Agrorent server running on port ${port}`);
  });
};

startServer();
