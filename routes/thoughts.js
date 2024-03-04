// routes/thoughts.js
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const User = require('../models/user');
const Thought = require('../models/Thoughts');
const router = express.Router();

// Add a new thought (protected route)
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { content, visibility } = req.body;
        const userId = req.user.userId;
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) { return res.status(404).json({ error: 'User not found' }); }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });
        await newUser.save();

        // Create a default thought for the user
        const defaultThought = new Thought({
            content: 'Welcome to Thoughts! Share your first thought.',
            author: newUser._id,
            visibility: 'public',
            comments: [], // Initialize comments array for the default thought
        });
        await defaultThought.save();
    
        // Update the user's thoughts array with the default thought's ID
        newUser.thoughts.push(defaultThought._id);
        await newUser.save();
  
        res.status(201).json({ message: 'Thought added successfully' });
    } catch (error) {
        console.error('Error adding thought:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;