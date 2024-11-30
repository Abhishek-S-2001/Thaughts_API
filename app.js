const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const mongo = require('./config');
const authRoutes = require('./routes/auth');
const thoughtsRoutes = require('./routes/thoughts');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 8080;
const body_parser = require('body-parser');

// Middleware to parse JSON in the request body
app.use(body_parser.json());

app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
}));


// Connect to MongoDB (use your MongoDB URI)
mongoose.connect(`mongodb+srv://${mongo.mongo_user}:${mongo.mongo_passcode}@cluster0.zgbiw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {  
  console.log('MongoDB connected successfully');
});


// API routes
app.use('/auth', authRoutes);
app.use('/thoughts', thoughtsRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: `API started on http://localhost:${PORT}`,
    timestamp: new Date().toISOString(),
  });
});

// Health-check endpoint
app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: `API started on http://localhost:${PORT}`,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
