var express = require('express');
var router = express.Router();
var User=require('../models/User');
var session= require('express-session');

router.use(session({
  secret:'ok',
  name:'userCookie',
  saveUninitialized:false,
  resave:false,
  
  cookie:{
    maxAge:60*1000*60*60*24*30
  }
}));

const userLoginChecker= (req,res,next)=>{
  if(!req.session.email){
    res.redirect('/user/login');
  }else{
    next();
  }
}

// const DirectToDashboard = (req,res,next) =>{
//   if(req.session.email){
//     res
//   }
// }



router.get('/signup',(req,res)=>{
  res.render('signup',{style:'signup.css'});
});

router.post('/signup',(req,res)=>{
   const {name,email,password,confirmPassword}=req.body
   if(password !==confirmPassword){
     res.render('signup',{name:name,email:email,password:password});
   }else{
  
  
    var newUser=new User({
     email:email,
     name:name,
     password:password
   
   });
  }
   newUser.save();
   res.redirect('/users/login');
  });


router.get("/",(req,res)=>{
  res.render('home');
});

router.get('/login',(req,res)=>{
  res.render('login',{style:'login.css'});
});
router.post('/login',(req,res)=>{
  const {email,password}=req.body;
  
  
  User.findOne({email:email,password:password}).lean().exec((err,data)=>{
    if(data){
      var isLogged;
      req.session.email = 1;
      res.render('landingpage',{isLogged:true,style:'landingpage.css'});
    }else{
      res.render('login',{msg:'error',style:'login.css'});
    }
  })
});
router.get('/forgotten',(req,res)=>{
  res.render('forgotten',{style:'forgotten.css'});
});

router.post('/forgotten',(req,res)=>{
  const {email,password,confirmpassword}=req.body;

  if(password !== confirmpassword){
    console.log('Enter same password');
    res.render('forgotten',{msg:'wrong password',email:email,password:password});
  }else{
    User.updateOne({email:email},{$set:{password:password}},(err)=>{
      if(err) throw err;
    });
    res.redirect('/products/landingpage');
    
  }

});










module.exports =userLoginChecker;
module.exports = router;
