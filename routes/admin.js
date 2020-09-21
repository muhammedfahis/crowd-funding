var express = require('express');
var router = express.Router();
var session= require('express-session');

/* GET home page. */

router.use(session({
  
  secret:'ok',
  name:'adminCookie',
  saveUninitialized:false,
  resave:false,
  
  cookie:{
    maxAge:60*1000*60*60*24*30
  }
}));



const Admin = {
  username: 'admin',
  password: '123'
}



const checkAdmin =(req,res,next)=>{
  if(!req.session.username){
    res.redirect('/login');
  }else{
  next();
}
}

const directDashboard= (req,res,next)=>{
  if(req.session.username){
    res.redirect('/dashboard');
  }
  next();
}



router.get('/login',(req, res) => {
  res.render('admin_login');
});
router.post('/login',(req,res) => {
  const { username, password } = req.body;
  if (username === Admin.username && password === Admin.password) {
    req.session.username = 1;
    console.log(req.session.username);
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

router.get('/dashboard',checkAdmin,(req,res) => {
  res.render('admin_dashboard');
})

router.post('/logout',(req,res)=>{
  req.session.destroy();

  res.clearCookie('adminCookie')
  res.redirect('/login')
})

module.exports = router;
