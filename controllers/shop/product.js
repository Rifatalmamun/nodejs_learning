const Product = require('../../models/product');

const index = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData])=>{
      console.log('rows: ', rows);
      console.log('fieldData: ', fieldData);

      res.render('shop/product/index', {
        prods: rows,
        pageTitle: 'Shop | products',
        path: '/products'
      });
    })
    .catch((err)=>{
      console.log(err);
    });
}

const show = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
  .then(([rows, fieldData])=>{
    console.log('rows: ', rows);

    res.render('shop/product/show', {
      product: rows[0],
      pageTitle: rows[0]?.title || 'Shop | Product Details',
      path: '/shop/product/show'
    });
  })
  .catch((err)=>{
    console.log(err);
  });


}

module.exports = {index, show};