const Order = require('../../models/Order');
const User = require('../../models/User');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const index = (req, res, next) => {
  Order.find({'user.userId': req.session.user._id})
  .then(result =>{
    res.render('shop/order/index', {
      pageTitle: 'Shop | Order',
      path: '/order',
      orders: result
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

const store = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(result => {
   
    const products = result.cart.items.map((d)=>{
      return {product: {...d.productId}, quantity: d.quantity}
    });

    const order = new Order({
      products: products,
      user:{
        name: req.session.user.name,
        userId: req.session.user // ref User
      }
    });

    order.save().then(()=>{
      // now remove the user cart
      User.findById(req.session.user._id).then((user)=>{
        user.cart.items = [];
        return user.save();
      })

      res.redirect('/orders')
    }).catch(err => console.log(err));
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

const downloadInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order =>{
      if(!order){
        return next(new Error('No order found!'));
      }
      if(order.user.userId.toString() !== req.user._id.toString()){
        return next(new Error('Unauthorized!'));
      }
      const invoiceName = 'invoice-'+ orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      // generate pdf
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="'+ invoiceName + '"');

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.text(`ORDER INVOICE #${orderId}`);
      pdfDoc.text('Order Details');
      pdfDoc.text('--------------------');
      pdfDoc.fontSize(22).text('Invoice', {
        underline: true
      });

      let totalPrice = 0;
      order.products.forEach((d)=>{
        totalPrice += d.quantity * d.product.price;
        pdfDoc.fontSize(14).text(
          d.product.title + 
          ' - quantity ' + 
          d.quantity +
          '| price: $' +
          d.product.price
        );
      });
      pdfDoc.text('Total price $' + totalPrice);
      
      pdfDoc.end();



      // read pdf form local sync way!
        // return fs.readFile(invoicePath, (err, data) => {
        //   if(err){
        //     return next(err);
        //   }
        //   res.setHeader('Content-Type', 'application/pdf');
        //   res.setHeader('Content-Disposition', 'attachment; filename="'+ invoiceName + '"');
        //   res.send(data);
        // });

      // read pdf from local file async way!
        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'attachment; filename="'+ invoiceName + '"');
        // file.pipe(res);
    }).catch(err =>{
      const error = new Error(err);
      err.httpStatusCode = 500;
      next(error);
    });
}

module.exports = {index, store, downloadInvoice}