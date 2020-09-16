var express = require('express');
var router = express.Router();

/* GET home page. */

const Admin={
  username:'admin',
  password:'admin'

}



router.get('/login',(req,res)=>{
  res.render('admin_login');
});
router.post('/login',(req,res)=>{
  const {username,password}=req.body;
  if(username === Admin.username && password === Admin.password){
    res.redirect('/dashboard');
  }else{
    res.redirect('/login');
  }
});

router.get('/dashboard',(req,res)=>{
  res.render('admin_dashboard');
})

module.exports = router;
