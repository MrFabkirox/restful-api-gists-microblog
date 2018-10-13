const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postTitle: String,
    postBody: String,
    userId: Number
});

module.exports = mongoose.model('Post', postSchema);
