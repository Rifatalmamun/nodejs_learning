const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const feedRoutes = require('./routes/feed');
const commonRoutes = require('./routes/common');
const authRoutes = require('./routes/auth');
const commonErrorHandle = require('./utils/commonErrorHandle');
const cors = require('cors');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString()+'-'+file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);
app.use('/images', express.static(path.join(__dirname,'images')));
app.use(cors());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });
app.use(commonRoutes.router);
app.use('/auth', authRoutes.router);
app.use('/feed', feedRoutes.router);

app.use(commonErrorHandle);

mongoose.connect('mongodb+srv://rifat:Rifat150107@cluster0.yi05v88.mongodb.net/blog')
    .then(result => {
        const server = app.listen(8080);
        
        // socket.io connection start
        const socketIO = require('./socket').init(server);

        socketIO.on('connection', socket => {
            console.log('client connected');
        })
        // end

        console.log('server running on port ', 8080);
    })
    .catch(err => {
        console.log('Connection failed!')
    });