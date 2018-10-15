const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comment = require('../models/comments');

router.get('/', (req, res, next) => {
    Comment.find()
      .select('commentPostBody _id commentPostId userId')
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
    const comment = new Comment({
        _id: mongoose.Types.ObjectId(),
        commentPostId: req.body.commentPostId,
        commentPostBody: req.body.commentPostBody
    });
    comment
      .save()
      .then(result => {
          res.status(201).json({
            message: 'Comment saved',
            _id: result._id,
            commentPostId: result.commentPostBody,
            commentPostBody: result.commentPostBody,
            userId: result.userId
          })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
              })
          })
});

router.get('/:commentId', (req, res, next) => {
    const id = req.params.commentId;
    if (id === 'special') {
        res.status(200).json({
          message: 'special id',
          id: id
        });
    } else {
        res.status(200).json({
            message: 'id passed'
        });
    }
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'patch update to /comments/:id'
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'delete to /comments/:id'
    });
});

module.exports = router;
