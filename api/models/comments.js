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
    commentCreationDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: Number,
        required: false,
        default: 1
    }
});
// s ou pas s a comments ?!
module.exports = mongoose.model('Comment', commentSchema);
