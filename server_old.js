const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Log startup
console.log('Starting server...');
console.log('Current directory:', __dirname);
console.log('Build folder exists:', fs.existsSync(path.join(__dirname, 'build')));

// Serve static files from the 'build' directory
const buildPath = path.join(__dirname, 'build');
console.log('Serving static files from:', buildPath);
app.use(express.static(buildPath));

// Handle all routes by serving index.html (for React Router)
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  console.log('Requested URL:', req.url);
  console.log('Sending file:', indexPath);
  
  if (!fs.existsSync(indexPath)) {
    console.error('ERROR: index.html not found at:', indexPath);
    res.status(404).send('index.html not found');
    return;
  }
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).send('Server error');
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📍 Visit: http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('🔴 Server error:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught exception:', err);
  process.exit(1);
});
