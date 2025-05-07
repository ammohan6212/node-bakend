// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// ✅ Disable X-Powered-By header to prevent tech stack disclosure
app.disable('x-powered-by');

// ✅ Apply Helmet for basic security headers
app.use(helmet());

// ✅ Secure JSON parsing with size limit to prevent DoS
app.use(express.json({ limit: '10kb' }));

// ✅ Log all requests using morgan
app.use(morgan('dev'));

// ✅ Connect to MongoDB (optional, placeholder URI)
mongoose.connect('mongodb://localhost:27017/secureapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ✅ Root route
app.get('/', (req, res) => {
  res.status(200).send('Hello, World!');
});

// ✅ Example route with input validation
app.post('/data', (req, res) => {
  const { name, age } = req.body;

  // Basic input validation
  if (typeof name !== 'string' || typeof age !== 'number') {
    return res.status(400).json({ message: 'Invalid input: name must be a string and age a number.' });
  }

  if (!name.trim() || age <= 0) {
    return res.status(400).json({ message: 'Name must not be empty and age must be positive.' });
  }

  res.status(200).json({ message: `Hello ${name}, you are ${age} years old!` });
});

// ✅ Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running securely at http://localhost:${PORT}`);
});
