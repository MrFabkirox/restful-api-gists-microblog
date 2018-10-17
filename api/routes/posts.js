const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Post = require('../models/posts');
const Comment = require('../models/comments');

const PostsController = require('../controllers/posts');

router.get('/', PostsController.posts_get_all);

router.post('/', PostsController.posts_create);

router.get('/:postId', );

router.patch('/:postId', checkAuth, PostsController.posts_patch);

router.delete('/:postId', checkAuth, PostsController.posts_delete);

module.exports = router;
