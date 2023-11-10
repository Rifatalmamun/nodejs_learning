const Product = require('../../models/product');

const index = (req, res, next) => {
  Product.fetchAll((products)=>{
    res.render('admin/product/index', {
      prods: products,
      pageTitle: 'Admin | products',
      path: '/admin/products',
      hasProducts: products?.length > 0,
      activeShop: true,
      productCSS: true
    })
  });
}

const create = (req, res, next) => {
    res.render('admin/product/create', {
      pageTitle: 'Admin | Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
}

const store = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    const product = new Product(title, imageUrl, price, description);
    product.save();
    res.redirect('/');
}

module.exports = {index, create, store};