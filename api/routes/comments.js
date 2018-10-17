const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const CommentsController = require('../controllers/comments');

router.get('/', CommentsController.comments_get_all);

router.post('/', CommentsController.comments_create);

router.get('/:commentId', CommentsController.comments_get_comment);

router.patch('/:commentId', checkAuth, CommentsController.comments_patch);

router.delete('/:commentId', checkAuth, CommentsController.comments_delete);

module.exports = router;
