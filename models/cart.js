const fs = require('fs')
const path = require('path')
const rootDir = require('../utils/path')

const p = path.join(rootDir,'data','cart.json');

module.exports = class Cart{
     static addToCart = (productId, productPrice) => {
          // fetch the previous cart
          fs.readFile(p, (err, fileContent) => {
               let cart = {products: [], totalPrice: 0};
               if(!err){
                    if(fileContent && fileContent.length > 0){
                         cart = JSON.parse(fileContent);
                    }
               }

               // analyze the cart - find existing product
               const existingProductIndex = cart.products.findIndex(product => product.id === productId);
               const existingProduct = cart.products[existingProductIndex];

               // add new product or increase quantity
               let updatedProduct;
               if(existingProduct){
                    updatedProduct = {...existingProduct};
                    updatedProduct.quantity = updatedProduct.quantity + 1;
                    cart.products = [...cart.products];
                    cart.products[existingProductIndex] = updatedProduct;
               }else{
                    updatedProduct = {id: productId,quantity: 1};
                    cart.products = [...cart.products, updatedProduct];
               }
               cart.totalPrice = Number(cart.totalPrice) + Number(productPrice);

               // save the cart to file
               fs.writeFile(p, JSON.stringify(cart), err =>{
                    console.log(err);
               });
          });
     };

     static fetchAll = (cb) => {
          fs.readFile(p, (err, fileContent) => {
               const cart = JSON.parse(fileContent);
               if(err){
                    cb(null);
               }else{
                    cb(cart);
               }
          });
     }

     static deleteCartProduct = (productId, productPrice) => {
          fs.readFile(p, (err, fileContent) => {
               if(err){
                    return;
               }
               const updatedCart = {...JSON.parse(fileContent)};

               const product = updatedCart.products.find((d)=> d.id === productId);
               if(!product){
                    return;
               }
               const otherProducts = updatedCart.products.filter((d)=> d.id !== productId);

               updatedCart.products = otherProducts;
               updatedCart.totalPrice = Number(updatedCart.totalPrice) - Number(product.price * product.quantity);

               fs.writeFile(p, JSON.stringify(updatedCart), err =>{
                    console.log(err);
               })
          });
     }
};