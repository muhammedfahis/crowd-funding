const express = require('express');
const router  = express.Router();
const Product=  require('../models/product');




router.get('/art',(req,res)=>{

    

  Product.find({category:'Arts'}).exec((err,data)=>{
      if(err) throw err;
      res.render('landingpage',{data:data,style:'landingpage.css'});
  })
});
router.get('/tech',(req,res)=>{

    Product.find({category:'Tech'}).exec((err,data)=>{
        if(err) throw err;
        res.render('landingpage',{data:data,style:'landingpage.css'});
    })
});

router.get('/fashion',(req,res)=>{
    

    Product.find({category:'Fashion'}).exec((err,data)=>{
        if(err) throw err;
        res.render('landingpage',{data:data,style:'landingpage.css'});
    })
    
});

router.get('/craft',(req,res)=>{
    Product.find({category:'Craft'}).exec((err,data)=>{
        if(err) throw err;
        res.render('landingpage',{data:data,style:'landingpage.css'});
    });
});

module.exports =router