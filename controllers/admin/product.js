const Product = require('../../models/Product');

const index = (req, res, next) => {
  Product.findAll()
  .then((response)=>{
    res.render('admin/product/index', {
      prods: response,
      pageTitle: 'Admin | products',
      path: '/admin/products'
    });
  }).catch((err)=>{
    console.log(err);
  });
}

const create = (req, res, next) => {
    res.render('admin/product/create', {
      pageTitle: 'Admin | Add Product',
      path: '/admin/add-product',
      editing: false,
    });
}

const store = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    console.log('user: ', req.user);
    // console.log('userId: ', req.user.id);

    Product.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      userId: 1 // suppose, login user id is 1
    }).then(()=>{
      res.redirect('/admin/products');
    }).catch((err)=>{
      console.log(err);
    });
}

const edit = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;

  if(!editMode){
    res.redirect('/');
  }

  Product.findByPk(productId)
    .then((response)=>{
      res.render('admin/product/create', {
        pageTitle: 'Admin | Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: response
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

  Product.findByPk(id)
    .then((product)=>{
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    }).then((response)=>{
      res.redirect('/admin/products');
      console.log('product updated successfully ', response);
    }).catch((err)=>{
      console.log(err);
    });
}

const destroy = (req, res, next) => {
  const id = req.body.productId;

  Product.findByPk(id)
    .then((product)=>{
      return product.destroy();
    }).then((response)=>{
      res.redirect('/admin/products');
    }).catch((err)=>{
      console.log(err);
    });
}


module.exports = {index, create, store, edit, update, destroy};