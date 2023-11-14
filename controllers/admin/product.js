const Product = require('../../models/product');

const index = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, fieldData])=>{
    res.render('admin/product/index', {
      prods: rows,
      pageTitle: 'Admin | products',
      path: '/admin/products'
    });
  })
  .catch((err)=>{
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
    
    const product = new Product(null, title, imageUrl, price, description);
    product.save()
      .then(()=>{
        res.redirect('/');
      })
      .catch((err)=>{
        console.log(err);
      });
    
}

const edit = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;

  if(!editMode){
    res.redirect('/');
  }

  Product.findById(productId, (product)=>{
    if(!product){
      res.redirect('/');
    }

    res.render('admin/product/create', {
      pageTitle: 'Admin | Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
}

const update = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  const updateProduct = new Product(id, title, imageUrl, price, description);
  updateProduct.save();
  res.redirect('/admin/products');

}

const destroy = (req, res, next) => {
  const id = req.body.productId;

  Product.deleteById(id);
  res.redirect('/admin/products');
}


module.exports = {index, create, store, edit, update, destroy};