var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login',(req,res)=>{
  res.render('admin_login');
})

module.exports = router;
