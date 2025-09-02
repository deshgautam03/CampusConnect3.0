const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Simple server working' });
});

// Email config route (simplified)
app.get('/api/email-config/:type', (req, res) => {
  res.json({ emails: [] });
});

app.put('/api/email-config/:type', (req, res) => {
  const { emails } = req.body;
  res.json({ message: 'Emails updated', emails });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log('Press Ctrl+C to stop');
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down simple server...');
  process.exit(0);
});
