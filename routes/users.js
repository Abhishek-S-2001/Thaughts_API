// routes/users.js (new file)
const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

const router = express.Router();

// Follow a user
router.post('/follow/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.userId;

    // Check if the user to follow exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the follower already follows the user
    if (!userToFollow.followers.includes(followerId)) {
      // Update the follower's followings array
      req.user.followings.push(userId);
      await req.user.save();

      // Update the user to follow's followers array
      userToFollow.followers.push(followerId);
      await userToFollow.save();
    }

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Unfollow a user
router.post('/unfollow/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.userId;

    // Check if the user to unfollow exists
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the follower follows the user
    const index = userToUnfollow.followers.indexOf(followerId);
    if (index !== -1) {
      // Remove the user to unfollow from the follower's followings array
      req.user.followings.splice(req.user.followings.indexOf(userId), 1);
      await req.user.save();

      // Remove the follower from the user to unfollow's followers array
      userToUnfollow.followers.splice(index, 1);
      await userToUnfollow.save();
    }

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;