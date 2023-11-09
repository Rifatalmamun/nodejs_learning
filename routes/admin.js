const express = require('express');

const router = express.Router();

router.get('/add-product',(req, res, next)=>{
    res.send('<form action="/admin/product" method="POST"><input name="title"/><button type="submit">submit</button></form>');
    console.log('route: add-product')
})

router.post('/product',(req, res, next)=>{
    console.log('form: ', req.body)
    res.redirect('/')
})

module.exports = router;