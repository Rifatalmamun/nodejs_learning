const express = require('express');

const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: true }));
app.use('/admin',adminRoutes);
app.use(shopRoutes);

// 404 page!
app.use((req, res, next)=>{
    res.status(404).send('<h1>Page Not Found</h1>')
});

app.listen(3005);