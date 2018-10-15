const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Post = require('../models/posts');

router.get('/', (req, res, next) => {
    Post.find()
      .select('postTitle postBody userId _id')
      .exec()
      .then(docs => {
          const response = {
              count: docs.length,
              products: docs.map(doc => {
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
              message: "post request",
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
    .select('postTitle postBody userId _id')
    .exec()
    .then(doc => {
      console.log("From db", doc);
      if (doc) {
        res.status(200).json({
            post: doc
        });
      } else {
        res
          .status(404)
          .json({
            message: "No valid entry found for that id"
          });
      }
    });
});

router.patch('/:postId', (req, res, next) => {
    const id = req.params.postId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Post.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
          res.status(200).json({
              message: 'Post updated',
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
