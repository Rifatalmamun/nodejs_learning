const Product = require('../../models/product');

const index = (req, res, next) => {
  Product.fetchAll((products)=>{
    res.render('shop/product/index', {
      prods: products,
      pageTitle: 'Shop | products',
      path: '/products',
      hasProducts: products?.length > 0,
      activeShop: true,
      productCSS: true
    })
  });
}

const show = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId, (product)=>{
    res.render('shop/product/show', {
      product: product,
      pageTitle: product?.title || 'Shop | Product Details',
      path: '/shop/product/show',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
  })


}

module.exports = {index, show};