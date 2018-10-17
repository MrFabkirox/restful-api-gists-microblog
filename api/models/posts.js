const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postTitle: { type: String, required: true },
    postBody: { type: String, required: true },
    userId: { type: Number, required: false }
});

module.exports = mongoose.model('Post', postSchema);
