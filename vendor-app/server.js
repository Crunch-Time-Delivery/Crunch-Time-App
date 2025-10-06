// server.js
const express = require('express');
const path = require('path');
const config = require('./config');
const setupRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.static(config.staticDir));

// Setup routes
setupRoutes(app, config);

// React fallback for client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(config.staticDir, 'index.html'));
});

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});