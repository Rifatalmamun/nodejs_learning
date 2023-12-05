const fs = require('fs');
const path = require('path');
const Feed = require('../models/Feed');
const {validationResult} = require('express-validator');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 3;
  let totalItems;

  Feed.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Feed.find().skip((currentPage-1) * perPage).limit(perPage);
    })
    .then(result => {
      res.status(200).json({
        posts: result,
        totalItems: totalItems
      });
    })
    .catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    const error = new Error('Validation failed! entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  if(!req.file){
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const creator = req.body.creator;
  const imageUrl = req.file.path;

  const feed = new Feed({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: creator
  });

  feed.save()
    .then(result => {
      res.status(201).json({
        message: 'feed created successfully!',
        post: result
      });
    })
    .catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  const id = req.params.id;

  if(!errors.isEmpty()){
    const error = new Error('Validation failed! entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if(req.file){
    imageUrl = req.file.path;
  }

  if(!imageUrl){
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  Feed.findById(id)
  .then(post => {
    if(!post){
      const error = new Error('could not find post');
      error.statusCode = 404;
      throw error;
    }

    if(imageUrl && imageUrl !== post.imageUrl){
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    return post.save();
  })
  .then(result => {
    res.status(200).json({message: 'post updated successfully', post: result});
  })
  .catch(error => {
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  })

}

exports.getPost = (req, res, next) => {
  const id = req.params.id;

  if(!id){
    const error = new Error('please provide post id');
    error.statusCode = 500;
    throw error;
  }

  Feed.findById(id)
    .then(result => {
      if(!result){
        const error = new Error('could not find post');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({message: 'post fetched successfully', post: result})
    })
    .catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    });
}

exports.deletePost = (req, res, next) => {
  const id = req.params.id;

  Feed.findById(id)
    .then(post => {
      if(!post){
        const error = new Error('could not find post');
        error.statusCode = 404;
        throw error;
      }
      if(post.imageUrl){
        clearImage(post.imageUrl);
      }
      return Feed.findByIdAndDelete(id);
    })
    .then(result => {
        res.status(200).json({message: 'post deleted successfully'});
    })
    .catch(error => {
      if(!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    })
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, error => {console.log(error)})
}