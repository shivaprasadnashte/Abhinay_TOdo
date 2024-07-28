const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('./conn/conn'); // Ensure this file correctly connects to your database
const auth = require('./routes/auth'); // Ensure these files correctly export the routes
const list = require('./routes/list');

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/v1', auth);
app.use('/api/v2', list);

// Serve React Frontend
app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

// Error handling for unknown routes
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route doesn\'t exist.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
