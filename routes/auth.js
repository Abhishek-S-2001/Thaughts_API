const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const User = require('../models/userModel');
const Thought = require('../models/thoughtsModel');
const UserData = require('../models/userDataModel');

const { JWT_Access_key, JWT_Access_Crypto_key, crypto_key, adminSecretKey } = require('../config');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, isAdmin, secretKey } = req.body;

    // If user is admin, verify the secret key
    if (isAdmin) {
      const encryptedSecretKey = CryptoJS.AES.decrypt(secretKey, crypto_key).toString(CryptoJS.enc.Utf8);
      if (encryptedSecretKey !== adminSecretKey) {
        return res.status(400).json({ error: 'Invalid secret key for admin registration.' });
      }
    }

    // Check if the username or email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered!!' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already used!!' });
    }

    // Decrypt the password
    let decryptedPassword = CryptoJS.AES.decrypt(password, crypto_key).toString(CryptoJS.enc.Utf8);

    // Hash the password
    const hashedPassword = await bcrypt.hash(decryptedPassword, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });

    await newUser.save();

    // If not admin, create default thought
    if (!isAdmin) {
      const defaultThought = new Thought({
        username: username,
        title: 'Default Thought',
        content: 'Welcome to Thoughts! Share your first thought.',
        author: newUser._id,
        visibility: 'public',
      });

      await defaultThought.save();

      // Store UserData
      const newUserData = new UserData({
        author: newUser._id,
        username: username,
        name: username,
        thoughts: defaultThought._id,
      });

      await newUserData.save();
    }

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
      return res.status(401).json({ error: 'Email Not Registered!!' });
    }

    // Decrypt the password
    let decryptedPassword = CryptoJS.AES.decrypt(password, crypto_key).toString(CryptoJS.enc.Utf8);

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(decryptedPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect Password!!' });
    }

    // Generate a JWT token
    const JWTtoken = jwt.sign({ userId: user._id }, JWT_Access_key, { expiresIn: '1h' });

    const token = CryptoJS.AES.encrypt(JWTtoken, JWT_Access_Crypto_key).toString();

    res.json({ token });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
