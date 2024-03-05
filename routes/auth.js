// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const {JWT_Access_key, JWT_Refresh_key} = require('../config')

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Create a default thought for the user
    const defaultThought = new Thought({
      title: 'Default Thought',
      content: 'Welcome to Thoughts! Share your first thought.',
      author: newUser._id,
      visibility: 'public',
    });

    // Save the default thought to the database
    await defaultThought.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Sign in a user
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Generate a JWT
      const token = jwt.sign({ userId: user._id }, JWT_Access_key, { expiresIn: '1h' });
      
      res.json({ token });
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;