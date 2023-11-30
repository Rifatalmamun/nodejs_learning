const mongoose = require('mongoose');
const Product = require('../../models/Product');
const {validationResult} = require('express-validator');
const {deleteFile} = require('../../utils/file');

const index = (req, res, next) => {
  Product.find({userId: req.user._id}).then((result)=>{
    res.render('admin/product/index', {
      prods: result?.length > 0 ? result : [],
      pageTitle: 'Admin | products',
      path: '/admin/products',
    });
  }).catch(err => console.log(err));
}

const create = (req, res, next) => {
  let message = req.flash('error');

  message = message?.length > 0 ? message[0] : null;

  res.render('admin/product/create', {
    pageTitle: 'Admin | Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: message,
    oldInput: {
      title: '',
      price: '',
      imageUrl: '',
      description: ''
    },
    validationErrors: [],
    hasError: false
  });
}

const store = (req, res, next) => {
  if(!req?.session?.user?._id){
    console.log('user not found');
    return;
  }
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.file;
    const errors = validationResult(req);

    console.log('image: ', image);

    if(!image){
      return res.status(422).render('admin/product/create', {
        pageTitle: 'Admin | Create Product',
        path: '/admin/create-product',
        editing: false,
        errorMessage: 'Attached file is not an image',
        product: {
          title: title,
          price: price,
          description: description
        },
        validationErrors: [],
        hasError: true
      });
    }

    if(!errors.isEmpty()){
      return res.status(422).render('admin/product/create', {
        pageTitle: 'Admin | Create Product',
        path: '/admin/create-product',
        editing: false,
        errorMessage: errors.array()[0].msg,
        product: {
          title: title,
          price: price,
          
          description: description
        },
        validationErrors: errors.array(),
        hasError: true
      });
    }

    const imageUrl = image.path;

    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user
    });

    product.save()
      .then(()=>{
        res.redirect('/admin/products');
      }).catch((err)=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
}

const edit = (req, res, next) => {
  const id = req.params.productId;
  const editMode = req.query.edit;

  if(!editMode){
    res.redirect('/');
  }

  Product.findById(id)
    .then((product)=>{
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/admin/products')
      }
      return res.render('admin/product/create', {
        pageTitle: 'Admin | Edit Product',
        path: '/admin/edit-product',
        editing: true,
        errorMessage: '',
        product: product,
        validationErrors: [],
        hasError: false
      });
    }).catch((err)=>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
}

const update = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price ? Number(req.body.price) : undefined;
  const description = req.body.description;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).render('admin/product/create', {
      pageTitle: 'Admin | Edit Product',
      path: `admin/product/edit/${id}?edit=true`,
      editing: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        price: price,
        description: description,
        _id: id
      },
      validationErrors: errors.array(),
      hasError: true
    })
  }

  Product.findById(id)
    .then(product =>{
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/admin/products')
      }
      product.title = title;
      product.price = price;
      product.description = description;
      if(image){
        deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      
      return product.save()
      .then(result =>{
        res.redirect('/admin/products');
      });
    }).catch((err)=>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

    //NOTE - ANOTHER WAY OF UPDATE
  // const objectId = new mongoose.Types.ObjectId(id);
  // Product.updateOne(
  //   {_id: objectId},
  //   {
  //     $set: {
  //       title: title,
  //       price: price,
  //       description: description,
  //       imageUrl: imageUrl
  //     }
  //   }
  // ).then(response =>{
  //   res.redirect('/admin/products');
  // }).catch(err =>{
  //   console.log(err);
  // });
}

const destroy = (req, res, next) => {
  const id = req.params.id;

  Product.findById(id)
  .then(product => {
    if(!product){
      return next(new Error('product not found!'));
    }
    deleteFile(product.imageUrl);
    return Product.deleteOne({_id: id, userId: req.user._id});
  }).then((result)=>{
    res.status(200).json({
      message: 'success'
    });
  }).catch((err)=>{
    res.status(500).json({
      message: 'failed'
    })
  });

  //NOTE - ANOTHER WAY OF DELETE
  // const id = req.body.productId;
  // Product.findOneAndDelete(id)
  // .then((response)=>{
  //   res.redirect('/admin/products');
  // }).catch((err)=>{
  //   console.log(err);
  // });
}

module.exports = {index, create, store, edit, update, destroy};