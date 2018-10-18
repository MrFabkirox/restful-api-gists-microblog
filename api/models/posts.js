const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postTitle: { type: String, required: true },
    postBody: { type: String, required: true },
    postCreationDate: { type: Date, default: Date.now },
    userId: { type: Number, required: false }
});

module.exports = mongoose.model('Post', postSchema);
