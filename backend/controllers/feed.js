exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      { _id: '1',
        title: 'A Journey to Inner Peace and Well-being', 
        content: 'Unlocking the Power of Mindfulness: A Journey to Inner Peace and Well-being',
        imageUrl: '/images/book.jpeg',
        createdAt: new Date(),
        creator: {
          name: 'Rifat'
        }
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: 
    { 
      _id: new Date().toISOString(),
      title: title,
      content: content,
      createdAt: createdAt,
      creator: {
        name: 'Rifat Al Mamun'
      }
    }
  });
};
