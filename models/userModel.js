// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  thoughts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thought' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hashtags: [{ type: String }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;