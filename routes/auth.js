// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Thought = require('../models/thoughtsModel')
const CryptoJS = require('crypto-js')

const {JWT_Access_key, JWT_Access_Crypto_key, crypto_key } = require('../config')

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
    // Decrypt the password
    let decryptedpassword = CryptoJS.AES.decrypt(password, crypto_key)
    decryptedpassword = decryptedpassword.toString(CryptoJS.enc.Utf8);

    // Hash the password
    const hashedPassword = await bcrypt.hash(decryptedpassword, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Create a default thought for the user
    const defaultThought = new Thought({
      username: username,
      title: 'Default Thought',
      content: 'Welcome to Thoughts! Share your first thought.',
      author: newUser._id,
      visibility: 'public',
    });

    // Save the default thought to the database
    await defaultThought.save();

    // Update the user's thoughts array
    newUser.thoughts.push(defaultThought._id);
    await newUser.save();

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
      console.log(req.body)
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Email Not Registered!!' });
      }

    // Decrypt the password
    let decryptedpassword = CryptoJS.AES.decrypt(password, crypto_key)
    decryptedpassword = decryptedpassword.toString(CryptoJS.enc.Utf8);

      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(decryptedpassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect Password!!' });
      }
      // Generate a JWT
      const JWTtoken = jwt.sign({ userId: user._id }, JWT_Access_key, { expiresIn: '1h' });

      const token = CryptoJS.AES.encrypt( JWTtoken, JWT_Access_Crypto_key).toString();
      
      res.json({ token });
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;