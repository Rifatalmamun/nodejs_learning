const mongoDB = require('mongodb');
const mongo = require('../config/database');

class Product{
    constructor(title, price, imageUrl, description, id, userId){
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongoDB.ObjectId(id) : null;
        this.userId = userId ? new mongoDB.ObjectId(userId): null;
    }

    save() {
        const db = mongo.getDB();
        let dbOp;

        if(this._id){
            // update the product
            dbOp = db.collection('products').updateOne({
                _id: this._id
            }, {$set: this});
        }else{
            // create the product
            dbOp = db.collection('products').insertOne(this)
        }

        return dbOp
            .then((res) => {
                // console.log(res);
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
        const objectId = new mongoDB.ObjectId(id);

        return db.collection('products').findOne({
                _id: objectId
            }).then(res => {
                return res;
            }).catch(err => {
                console.log(err);
            });
    }

    static deleteById(id) {
        const db = mongo.getDB();
        const objectId = new mongoDB.ObjectId(id);

        return db.collection('products').deleteOne({
            _id: objectId
        }).then((res)=>{
            return res;
        })
        .catch(err => {
            console.log(err);
        });
    }
}

module.exports = Product;