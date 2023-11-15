const mongoDB = require('mongodb');
const mongo = require('../config/database');

class Product{
    constructor(id, title, price, imageUrl, description){
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id;
    }

    save() {
        const db = mongo.getDB();
        let dbOp;

        if(this._id){
            // update the product
            dbOp = db.collection('products').updateOne({
                _id: new mongoDB.ObjectId(this._id)
            }, {$set: this});
        }else{
            // create the product
            dbOp = db.collection('products').insertOne(this)
        }

        return dbOp
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = mongo.getDB();
        return db.collection('products').find().toArray()
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static findById(id) {
        const db = mongo.getDB();
        return db.collection('products').find({
                _id: new mongoDB.ObjectId(id)
            }).next()
            .then(res => {
                console.log('findById response: ', res);
                return res;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteById(id) {
        const db = mongo.getDB();

        return db.collection('products').deleteOne({
            _id: new mongoDB.ObjectId(id)
        }).then((res)=>{
            return res;
        })
        .catch(err => {
            console.log(err);
        });
    }
}

module.exports = Product;