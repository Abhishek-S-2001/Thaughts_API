// routes/thoughts.js
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
// const User = require('../models/userModel');
const Thought = require('../models/thoughtsModel');
const UserData = require('../models/userDataModel');

const router = express.Router();


// Retrieve all thoughts (public or user-specific)
router.get('/all', async (req, res) => {
  try {
    const { userId } = req.query;

    // If userId is provided, retrieve thoughts of a specific user
    const thoughts = userId
      ? await Thought.find({ author: userId, visibility: 'public' })
      : await Thought.find({ visibility: 'public' });
    res.json({ thoughts });
  } catch (error) {
    console.error('Error retrieving thoughts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Retrieve a single thought by ID
router.get('/:thoughtId', async (req, res) => {
  try {
    const { thoughtId } = req.params;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    res.json({ thought });
  } catch (error) {
    console.error('Error retrieving thought:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add a new thought (protected route)
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { title, content, visibility, hashtags } = req.body;
    const userId = req.user.userId;

    // Check if the user exists
    const user = await UserData.find({ author: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new thought with hashtags
    const newThought = new Thought({
      username : user.username,
      title,
      content,
      author: userId,
      visibility,
      hashtags,
    });

    await newThought.save();

    // Update the user's thoughts array
    user.thoughts.push(newThought._id);
    await user.save();

    res.status(201).json({ message: 'Thought added successfully' });
  } catch (error) {
    console.error('Error adding thought:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update a thought by ID
router.put('/:thoughtId', authenticateToken, async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.userId;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    // Check if the user is the author of the thought
    if (thought.author.toString() !== userId) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    thought.title = title;
    thought.content = content;
    await thought.save();

    res.json({ message: 'Thought updated successfully' });
  } catch (error) {
    console.error('Error updating thought:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete a thought by ID
router.delete('/:thoughtId', authenticateToken, async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const userId = req.user.userId;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }

    // Check if the user is the author of the thought
    if (thought.author.toString() !== userId) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Remove the thought from the user's thoughts array
    const user = await UserData.find({ author: userId});
    user.thoughts = user.thoughts.filter((thought) => thought.toString() !== thoughtId);
    await user.save();
    await thought.remove();

    res.json({ message: 'Thought deleted successfully' });
  } catch (error) {
    console.error('Error deleting thought:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
module.exports = router;