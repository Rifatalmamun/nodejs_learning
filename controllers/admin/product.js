const Product = require('../../models/Product');
const mongoDB = require('mongodb');

const objectId = mongoDB.ObjectId;

const index = (req, res, next) => {
  Product.fetchAll().then((response)=>{
    res.render('admin/product/index', {
      prods: response?.length > 0 ? response : [],
      pageTitle: 'Admin | products',
      path: '/admin/products'
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
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const loggedInUserId = req.user._id;

    const product = new Product(
      title, 
      price, 
      imageUrl, 
      description, 
      null, // product id when create a product is null
      loggedInUserId
      );

    product.save()
      .then(()=>{
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

  Product.findById(productId)
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

  const updateProduct = new Product(title, price, imageUrl, description, id);

  updateProduct.save(id)
    .then((response)=>{
      res.redirect('/admin/products');
    }).catch((err)=>{
      console.log(err);
    });
}

const destroy = (req, res, next) => {
  const id = req.body.productId;

  Product.deleteById(id)
  .then(()=>{
    res.redirect('/admin/products');
  }).catch((err)=>{
    console.log(err);
  });
}


module.exports = {index, create, store, edit, update, destroy};