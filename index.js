const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ToDo API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Example query
app.get('/todos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM todos');
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
const { body, validationResult } = require('express-validator');

app.post('/todos', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('completed').isBoolean().withMessage('Completed must be a boolean')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Insert into database
  try {
    const { title, description, completed } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO todos (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
      [title, description, completed]
    );
    res.status(201).send(rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Set up CORS
app.use(cors());

// Set up Helmet for basic security enhancements
app.use(helmet());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);


