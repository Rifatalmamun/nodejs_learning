const mongoose = require('mongoose');
const Product = require('../../models/Product');

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
    res.render('admin/product/create', {
      pageTitle: 'Admin | Add Product',
      path: '/admin/add-product',
      editing: false,
    });
}

const store = (req, res, next) => {
  if(!req?.session?.user?._id){
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
    .then((product)=>{
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/admin/products')
      }
      return res.render('admin/product/create', {
        pageTitle: 'Admin | Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
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
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/admin/products')
      }
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      
      return product.save()
      .then(result =>{
        res.redirect('/admin/products');
      });
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
  const id = req.body.productId;

  Product.deleteOne({_id: id, userId: req.user._id})
  .then((result)=>{
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