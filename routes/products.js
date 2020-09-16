const express=require('express');
const router=express.Router();
const Product=require('../models/product');





router.get('/landingpage',(req,res)=>{
    res.render('landingpage',{style:'landingpage.css'});
  });
router.post('/landingpage',(req,res)=>{
  Product.find({}).lean().exec((err,data)=>{
    if(err) throw err;
    res.render('landingpage',{data});
  })
})




  module.exports=router;

