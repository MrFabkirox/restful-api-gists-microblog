const mongoose = require("mongoose");

const Post = require('../models/posts');
const Comment = require('../models/comments');
// no s
exports.posts_get_all = (req, res, next) => {
    Post.find()
      .select('_id postTitle postBody postCreationDate userId')
      .sort({ postCreationDate: -1 })
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
            posts: docs.map(doc => {
              return {
                _id: doc._id,
                postTitle: doc.postTitle,
                postBody: doc.postBody,
                postCreationDate: doc.postCreationDate,
                userId: doc.userId
              }
          })
        };
        res.status(200).json(response);
      })
      .catch();
}

exports.posts_create = (req, res, next) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
    postCreationDate: req.body.postCreationDate,
    userId: req.body.userId
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "post posted",
          createdPost: {
            _id: result._id,
            postTitle: result.postTitle,
            postBody: result.postBody,
            postCreationDate: result.postCreationDate,
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
}

exports.posts_get_post = (req, res, next) => {
  const id = req.params.postId;
  Post.findById(id)
    .select('_id postTitle postBody postCreationDate userId')
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
}

exports.posts_patch = (req, res, next) => {
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
}

exports.posts_delete = (req, res, next) => {
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
}