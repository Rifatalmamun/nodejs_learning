const mongoDB = require('mongodb');
const mongoClient = mongoDB.MongoClient;

let _db;
const mongoConnect = (cb) =>{
    const url = 'mongodb+srv://rifat:Rifat150107@cluster0.yi05v88.mongodb.net/shop';
    mongoClient.connect(url)
    .then((res)=>{
        _db = res.db();
        cb();
    }).catch((err)=>{
        console.log(err);
    });
}

const getDB = () => {
    if(_db){
        return _db;
    }

    throw 'No database found!';
}

module.exports = {mongoConnect, getDB};