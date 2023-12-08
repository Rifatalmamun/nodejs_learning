const fs = require("fs");
const path = require("path");
const Feed = require("../models/Feed");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const io = require("../socket");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (error) => {
  });
};

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 3;

  try {
    const totalItems = await Feed.find().countDocuments();
    const posts = await Feed.find()
      .populate("creator")
      .sort({ createdAt: -1 }) // descending order of createdAts
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    //NOTE - fetch posts with user details

    res.status(200).json({
      posts: posts,
      totalItems: totalItems,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed! entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  const imageUrl = req.file.path;

  const feed = new Feed({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: req.userId,
  });

  try {
    await feed.save();
    const user = await User.findById(req.userId);
    user.feeds.push(feed);
    await user.save();

    //NOTE - notify client via socket.io that a new post created
    io.getIO().emit("post", {
      action: "create",
      post: { ...feed._doc, creator: { _id: req.userId, name: user.name } },
    });
    // end

    res.status(201).json({
      message: "feed created successfully!",
      post: feed,
      creator: { _id: user._id, name: user.name },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  const id = req.params.id;

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed! entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  try {
    const post = await Feed.findById(id).populate("creator");

    if (!post) {
      const error = new Error("could not find post");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId) {
      const error = new Error("not authorized");
      error.statusCode = 401;
      throw error;
    }

    if (imageUrl && imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const result = await post.save();

    //NOTE - notify client via socket.io that a new post updated
    io.getIO().emit("post", { action: "update", post: result });
    //end
    res.status(200).json({ message: "post updated successfully", post: post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    const error = new Error("please provide post id");
    error.statusCode = 500;
    throw error;
  }

  try {
    const feed = await Feed.findById(id);

    if (!feed) {
      const error = new Error("could not find post");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "post fetched successfully", post: feed });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const id = req.params.id;

  try {
    const post = await Feed.findById(id);

    if (!post) {
      const error = new Error("could not find post");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("not authorized");
      error.statusCode = 401;
      throw error;
    }

    if (post.imageUrl) {
      clearImage(post.imageUrl);
    }
    await Feed.findByIdAndDelete(id);
    const user = await User.findById(req.userId);
    user.feeds.pull(id);
    await user.save();

    //NOTE - notify client via socket.io that a new post deleted
    io.getIO().emit('post', { action: 'delete', post: id });
    //end

    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
