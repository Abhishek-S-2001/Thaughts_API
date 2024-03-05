// app.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const thoughtsRoutes = require('./routes/thoughts')
const usersRoutes = require('./routes/users');

const app = express();
const port = 3000;

app.use(express.json());

// Connect to MongoDB (use your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/Thoughts_db');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {  console.log('MongoDB connected successfully');});


// API routes
app.use('/auth', authRoutes);
app.use('/thoughts', thoughtsRoutes);
app.use('/users', usersRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
