const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comment = require('../models/comments');
const Post = require('../models/posts');

router.get('/', (req, res, next) => {
    Comment.find()
      .select('_id commentPostId commentPostBody userId')
      .populate('commentPostId')
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          comment: docs.map(doc => {
            return {
              _id: doc._id,
              commentPostId: doc.commentPostBody,
              commentPostBody: doc.commentPostBody,
              userId: doc.userId
            }
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
    })
});

router.post('/', (req, res, next) => {
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
        userId: req.body.userId
      });
      return comment.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Comment saved',
        createdComment: {
          _id: result._id,
          commentPostId: result.commentPostBody,
          commentPostBody: result.commentPostBody,
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
});

router.get('/:commentId', (req, res, next) => {
  const id = req.params.commentId;
  Comment.findById(id)
    .select('_id commentPostId commentPostBody userId')
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
});

router.patch('/:commentId', (req, res, next) => {
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
});

router.delete('/:commentId', (req, res, next) => {
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
});

module.exports = router;
