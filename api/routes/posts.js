const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Post = require('../models/posts');

router.get('/', (req, res, next) => {
  Post.find()
    .select('_id postTitle postBody userId')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
          posts: docs.map(doc => {
            return {
              postTitle: doc.postTitle,
              postBody: doc.postBody,
              userId: doc.userId,
              _id: doc._id
            }
        })
      };
      res.status(200).json(response);
    })
    .catch();
});

router.post('/', (req, res, next) => {
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        postTitle: req.body.postTitle,
        postBody: req.body.postBody,
        userId: req.body.userId
    });
    post
      .save()
      .then(result => {
          console.log(result);
          res.status(201).json({
              message: "post posted",
              createdPost: {
                postTitle: result.postTitle,
                postBody: result.postBody,
                userId: result.userId
              }
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
          error: err
      });
    })
});

router.get('/:postId', (req, res, next) => {
  const id = req.params.postId;
  Post.findById(id)
    .select('_id postTitle postBody userId')
    .exec()
    .then(result => {
      console.log("From db", result);
      if (result) {
        res.status(200).json({
            post: result
        });
      } else {
        res
          .status(404)
          .json({
            message: "No valid entry found for that id"
          });
      }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.patch('/:postId', (req, res, next) => {
    const postId = req.params.postId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Post.update({ _id: postId }, { $set: updateOps })
      .exec()
      .then(result => {
          res.status(200).json({
              message: 'Post updated'
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          })
      })
});

router.delete('/:postId', (req, res, next) => {
    const id = req.params.postId;
    Post.remove({ _id: id })
      .exec()
      .then(result => {
          res.status(200).json({
              message: 'Post deleted'
          });
      })
      .catch(err => {
          console.log(500).json({
              error: err
          });
      });
});

module.exports = router;
