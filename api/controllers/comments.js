const mongoose = require("mongoose");

const Comment = require("../models/comments");
const Post = require("../models/posts");
// no s
exports.comments_get_all = (req, res, next) => {
    Comment.find()
      .select('_id commentPostId commentPostBody commentCreationDate userId')
      .sort({ commentCreationDate: -1 })
      .populate('commentId', '_id')
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          comment: docs.map(doc => {
            return {
              _id: doc._id,
              commentPostId: doc.commentPostId,
              commentPostBody: doc.commentPostBody,
              userId: doc.userId,
              commentCreationDate: doc.commentCreationDate,
//              post: doc.post
            }
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
    })
}

exports.comments_create = (req, res, next) => {
  Post.findById(req.body.commentPostId)
    .then(post => {
      if (!post) {
          return res.status(404).json({
              message: 'Post not found'
          });
      }
      const comment = new Comment({
        _id: mongoose.Types.ObjectId(),
        commentPostId: req.body.commentPostId,
        commentPostBody: req.body.commentPostBody,
        commentCreationDate: req.body.commentCreationDate,
        userId: req.body.userId
      });
      return comment.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Comment saved',
        createdComment: {
          postId: result.postId,
          commentPostId: result.commentPostBody,
          commentPostBody: result.commentPostBody,
          commentCreationDate: result.commentCreationDate,
          userId: result.userId
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.comments_get_comment = (req, res, next) => {
  const id = req.params.commentId;
  Comment.findById(id)
    .select('_id commentPostId commentPostBody commentCreationDate userId')
    .exec()
    .then(result => {
        console.log('From database', result);
        if (result) {
            res.status(200).json({
                comment: result
            })
        } else {
          res
            .status(404)
            .json({
                message: 'No entry'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.comments_patch = (req, res, next) => {
  const commentId = req.params.commentId;
  const updateOps = {};
  for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
  }
  Comment.update({ _id: commentId }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Comment updated',
        newComment: result
      })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}

exports.comments_delete = (req, res, next) => {
  Comment.deleteOne({
      _id: req.params.commentId
  }, function (err) {})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Comment deleted"
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}