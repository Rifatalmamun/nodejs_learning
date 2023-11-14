const Product = require('../../models/Product');

const index = (req, res, next) => {
  Product.findAll()
  .then((response)=>{
    res.render('shop/product/index', {
      prods: response,
      pageTitle: 'Shop | products',
      path: '/products'
    });
  }).catch((err)=>{
    console.log(err);
  });
}

const show = (req, res, next) => {
  const productId = req.params.productId;

  Product.findByPk(productId)
  .then((response)=>{
    res.render('shop/product/show', {
      product: response,
      pageTitle: response?.title || 'Shop | Product Details',
      path: '/shop/product/show'
    });
  })
  .catch((err)=>{
    console.log(err);
  });

  // another way - findAll return an array
  // Product.findAll({where:{id: productId}})
  // .then((response)=>{
  //   res.render('shop/product/show', {
  //     product: response[0],
  //     pageTitle: response[0]?.title || 'Shop | Product Details',
  //     path: '/shop/product/show'
  //   });
  // })
  // .catch((err)=>{
  //   console.log(err);
  // });

}

module.exports = {index, show};