// Import core modules
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ✅ Security middleware
app.use(helmet()); // Sets secure HTTP headers
app.disable('x-powered-by'); // Hides Express tech stack

// ✅ Limit repeated requests (basic DDoS protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ✅ Body parser with payload limit
app.use(express.json({ limit: '10kb' }));

// ✅ Simple root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Secure Hello World!' });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Secure server running at http://localhost:${PORT}`);
});
