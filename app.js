// Import required modules
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to log requests
app.use(morgan('dev'));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Root route: Hello World
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Example route to handle JSON request body
app.post('/data', (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).json({ message: 'Name and age are required!' });
  }
  res.json({ message: `Hello ${name}, you are ${age} years old!` });
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
