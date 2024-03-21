// models/Thought.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const thoughtSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  hashtags: [{ type: String }],
  comments: [commentSchema],
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;