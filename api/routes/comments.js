const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get request to /comments'
    });
});

router.post('/', (req, res, next) => {
    const comment = {
        postId: req.body.postId,
        userID: req.body.userId,
        postComment: req.body.postComment,
    };
    res.status(201).json({
        message: 'post request to /comments',
        comment: comment
    });
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
