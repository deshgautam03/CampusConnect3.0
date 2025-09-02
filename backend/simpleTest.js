console.log('Simple test starting...');

// Keep the process alive
setInterval(() => {
  console.log('Still running...', new Date().toISOString());
}, 5000);

console.log('Simple test started, should keep running...');
