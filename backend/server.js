const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: 'config.env' });
const { addClient, removeClient } = require('./utils/realtime');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ensure uploads directory exists
try {
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
} catch (_) {}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-events-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('MongoDB Connected successfully');
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  // Don't exit, just log the error
});

// MongoDB connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

// Routes
console.log('Loading routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('Auth route loaded');
app.use('/api/events', require('./routes/events'));
console.log('Events route loaded');
app.use('/api/users', require('./routes/users'));
console.log('Users route loaded');
app.use('/api/applications', require('./routes/applications'));
console.log('Applications route loaded');
app.use('/api/notifications', require('./routes/notifications'));
console.log('Notifications route loaded');
app.use('/api/email-config', require('./routes/emailConfig'));
console.log('EmailConfig route loaded');

// Debug: List all registered routes
console.log('Registered routes:');
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(`  ${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

// Test route to verify routing is working
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});
console.log('Test route added');

// Server-Sent Events endpoint for realtime
app.get('/api/realtime', async (req, res) => {
  try {
    const tokenFromHeader = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.query.token || tokenFromHeader;
    if (!token) return res.status(401).end();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).end();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const client = addClient(res, user);

  req.on('close', () => {
    removeClient(res);
  });
  } catch (_) {
    res.status(401).end();
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Error handling for server
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Keep the server running
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Keep alive mechanism
setInterval(() => {
  console.log('Server heartbeat...', new Date().toISOString());
}, 30000);

console.log('Server started successfully and will stay running');
console.log('Press Ctrl+C to stop the server');
