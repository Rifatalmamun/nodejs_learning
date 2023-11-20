const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true},
                quantity: { type: Number, required: true}
            }
        ]
    }
});

userSchema.methods.addToCart = function(product) {

    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }

    this.cart = {
        items: updatedCartItems
      };
    return this.save();
};

userSchema.methods.deleteCartProduct = function (productId) {

    const updatedCartItems = this.cart?.items?.filter((item)=> item.productId.toString() !== productId.toString());
    console.log(updatedCartItems);

    this.cart.items = updatedCartItems;
    return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongoDB = require('mongodb');
// const mongo = require('../config/database');

// class User {
//     constructor(name, email, cart, id){
//         this.name = name;
//         this.email = email;
//         this.cart = cart; // {items: []}
//         this._id = id;
//     }

//     save(){
//         const db = mongo.getDB();
        
//         return db.collection('users').insertOne(this)
//             .then((res)=>{
//                 // console.log(res);
//             }).catch((err)=>{
//                 console.log(err);
//             });
//     }

//     static fetchAll() {
//         const db = mongo.getDB();
//         return db.collection('users').find().toArray()
//             .then(res => {
//                 return res;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static findById(id){
//         const db = mongo.getDB();
//         const objectId = new mongoDB.ObjectId(id);

//         return db.collection('users').findOne({
//             _id: objectId
//         }).then(res => {
//             return res;
//         }).catch(err => {
//             console.log(err);
//         });
//     }

//     // cart related methods

//     addToCart(product){
        // const tempCart = this.cart?.items ?? [];
        // const cartItems = [...tempCart];
        
        // const cartItemIndex = cartItems?.findIndex((cItem)=> cItem.productId.toString() === product._id.toString());

        // if(cartItemIndex >=0){
        //     cartItems[cartItemIndex].quantity = cartItems[cartItemIndex].quantity + 1;
        // }else{
        //     const newItem = {productId: new mongoDB.ObjectId(product._id), quantity: 1 };
        //     cartItems.push(newItem);
        // }

        // const db = mongo.getDB();
        
        // return db.collection('users').updateOne({
        //     _id: new mongoDB.ObjectId(this._id),
        // },{
        //     $set: {
        //         cart: {
        //             items: cartItems 
        //         }
        //     }
        // });
//     }

//     getCart(){
//         const db = mongo.getDB();
//         const productIds = this.cart?.items.map((d)=> d.productId);

//         return db.collection('products').find({_id: {$in: productIds}}).toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart?.items?.find(i =>{
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     }
//                 })
//             }).catch(err => {
//                 console.log(err);
//             })
//     }

//     deleteCartProduct(productId){
//         const db = mongo.getDB();
//         const cartItems = this.cart?.items ?? [];

//         const otherCartItems = cartItems?.filter((item)=> item.productId.toString() !== productId.toString());

//         return db.collection('users').updateOne({
//             _id: new mongoDB.ObjectId(this._id),
//         },{
//             $set: {
//                 cart: {
//                     items: otherCartItems 
//                 }
//             }
//         })
//         .then(res => console.log(res))
//         .catch(err => console.log(err));
//     }

//     // order related methods===============
//     addOrder(){
//         const db = mongo.getDB();
//         const userId = new mongoDB.ObjectId(this._id);

//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user:{
//                     _id: userId,
//                     name: this.name
//                 }
//             }
//             return db.collection('orders').insertOne(order);
//         }).then(res =>{
//                 this.cart = {items: []};
//                 return db.collection('users').updateOne(
//                     {_id: userId},
//                     {$set: {cart: {items: []}}}
//                 )
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     getOrders(){
//         const db = mongo.getDB();
//         return db.collection('orders')
//             .find({ 'user._id': new mongoDB.ObjectId(this._id)}).toArray()
//             .then(res => {
//                 return res;
//             })
//             .catch(err => console.log(err));
//     }
// }

// module.exports = User;