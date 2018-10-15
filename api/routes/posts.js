const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Post = require('../models/posts');

router.get('/', (req, res, next) => {
    Post.find()
      .exec()
      .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch();
});

router.post('/', (req, res, next) => {
    const post = new Post({
        _id: new mongoose.Types.ObjectId,
        postTitle: req.body.postTitle,
        postBody: req.body.postBody,
        userId: req.body.userId
    });
    post
      .save()
      .then(result => {
          console.log(result);
      })
      .catch(err => console.log(err));
    res.status(201).json({
        message: 'post request to /posts',
        post: post
    });
});

router.get('/:postId', (req, res, next) => {
    const id = req.params.postId;
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

router.patch('/:postId', (req, res, next) => {
    const id = req.params.postId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Post.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
          console.log(result);
          res.status(200).json(result);
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
          res.status(200).json(result);
      })
      .catch(err => {
          console.log(500).json({
              error: err
          });
      });
});

module.exports = router;
