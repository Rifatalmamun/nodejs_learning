const express = require('express');
const feedValidator = require('../validator/feed');
const isAuth = require('../middleware/isAuth');

const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/posts', isAuth, feedController.getPosts);
router.post('/post', isAuth, feedValidator.postFeed, feedController.createPost);
router.put('/post/:id', isAuth, feedValidator.postFeed, feedController.updatePost);
router.get('/post/:id', isAuth, feedController.getPost);
router.delete('/post/:id', isAuth, feedController.deletePost);

module.exports = {router};