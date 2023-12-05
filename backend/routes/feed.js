const express = require('express');
const feedValidator = require('../validator/feed');

const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);
router.post('/post', feedValidator.postFeed, feedController.createPost);
router.put('/post/:id', feedValidator.postFeed, feedController.updatePost);
router.get('/post/:id', feedController.getPost);
router.delete('/post/:id', feedController.deletePost);

module.exports = router;