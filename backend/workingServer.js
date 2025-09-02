const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Working server test' });
});

const PORT = 5003;
const server = app.listen(PORT, () => {
  console.log(`Working server running on port ${PORT}`);
  console.log('Press Ctrl+C to stop');
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down working server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Keep alive
setInterval(() => {
  console.log('Server heartbeat...');
}, 30000);
