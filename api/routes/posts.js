const express = require('express');
const router = express.Router();

const Post = require('../models/posts');

router.get('/', (req, res, next) => {
    res.status(201).json({
        message: 'get request to /posts'
    });
});

router.post('/', (req, res, next) => {
    const post = new Post({
        _id: mongoose.Types.ObjectId,
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

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'patch update to /posts/:id'
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'delete to /posts/:id'
    });
});

module.exports = router;
