// models/userDataModel.js
const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    username: { type: String, required: true},
    name: { type: String},
    thoughts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thought' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hashtags: [{ type: String }],
});

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;