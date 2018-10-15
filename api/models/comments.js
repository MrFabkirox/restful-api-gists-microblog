const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    commentPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    commentPostBody: {
        type: String,
         required: true
    },
    userId: {
        type: Number,
        required: false,
        default: 1
    }
});

module.exports = mongoose.model('Comment', commentSchema);
