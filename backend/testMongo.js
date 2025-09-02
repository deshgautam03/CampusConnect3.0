const mongoose = require('mongoose');
require('dotenv').config({ path: 'config.env' });

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('MongoDB Connected successfully');
  
  // Test a simple operation
  return mongoose.connection.db.admin().ping();
})
.then(() => {
  console.log('MongoDB ping successful');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Keep the process alive
setTimeout(() => {
  console.log('Connection test completed');
  process.exit(0);
}, 10000);
