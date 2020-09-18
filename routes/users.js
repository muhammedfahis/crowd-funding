var express = require('express');
var router = express.Router();
var User=require('../models/User');

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
  User.find({email:email,password:password}).exec((err,data)=>{
    if(data){
      res.redirect('/users');
    }else{
      res.render('login',{msg:'error'});
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
    res.redirect('/users');
    
  }

});











module.exports = router;
