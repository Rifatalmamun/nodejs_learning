const mongoose = require('mongoose');
const Product = require('../../models/Product');

const index = (req, res, next) => {
  Product.find().then((response)=>{
    res.render('admin/product/index', {
      prods: response?.length > 0 ? response : [],
      pageTitle: 'Admin | products',
      path: '/admin/products',
      isAuthenticated: req.isLoggedIn
    });
  }).catch(err => console.log(err));
}

const create = (req, res, next) => {
    res.render('admin/product/create', {
      pageTitle: 'Admin | Add Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated: req.isLoggedIn
    });
}

const store = (req, res, next) => {
  if(!req?.user?._id){
    console.log('user not found');
    return;
  }
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

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
        console.log(err);
      });
}

const edit = (req, res, next) => {
  const id = req.params.productId;
  const editMode = req.query.edit;

  if(!editMode){
    res.redirect('/');
  }

  Product.findById(id)
    .then((response)=>{
      res.render('admin/product/create', {
        pageTitle: 'Admin | Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: response,
        isAuthenticated: req.isLoggedIn
      });
    }).catch((err)=>{
      console.log(err);
    })
}

const update = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.findById(id)
    .then(product =>{
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      
      return product.save();
    }).then(response =>{
      res.redirect('/admin/products');
    }).catch((err)=>{
      console.log(err);
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
  const objectId = new mongoose.Types.ObjectId(req.body.productId);

  Product.deleteOne({_id: objectId})
  .then(()=>{
    res.redirect('/admin/products');
  }).catch((err)=>{
    console.log(err);
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