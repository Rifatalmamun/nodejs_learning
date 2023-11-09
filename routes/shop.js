const express = require('express');
const router = express.Router();

router.get('/',(req, res, next)=>{
    res.send('<h1>shop root page</h1>')
    console.log('route: shop root')
})

module.exports = router;