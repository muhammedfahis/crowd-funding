const express=require('express');
const router=express.Router();
const Product=require('../models/product');
const fs=require('fs-extra');
const mkdirp=require('mkdirp');
const resizeimg=require('resize-img');
const multer=require('multer');
const path=require('path');




var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: Storage,
}).single("image"); //Field name and max count



router.get('/start_project',(req,res)=>{
  res.render('startProject',{style:'start_project.css'});
});

router.get('/rules',(req,res)=>{
  res.render('project_rules',{style:'project_rules.css'});
});



router.post('/project_upload',(req,res)=>{
  upload(req,res,(err)=>{
    if(err){
      console.log(err);
    }else{
      console.log(req.file.path);
      
      var filename= req.file.filename
      
     const newProduct=new Product({
      category:req.body.category,
      country:req.body.country,
      discription:req.body.discription,
      checkbox_1:req.body.checkbox_1,
      checkbox_2:req.body.checkbox_2,
      price:req.body.price,
      target:req.body.target,
      img:filename
     
    });
    newProduct.save()
  }
  });
 });


router.get('/upload_photo',(req,res)=>{
  res.render('photoUpload',{style:'photo_upload.css'});
});




router.get('/landingpage',(req,res)=>{
  Product.find({}).exec((err,data)=>{
    if(err) throw err;
    
     res.render('landingpage',{data:data,style:'landingpage.css'});
  })
})

router.get('/items',(req,res)=>{
 

  Product.find({}).exec((err,data)=>{
    if(err)throw err;
    
    res.render('product_page',{data:data,style:'product_page.css'});
 
  })
})



router.post('/items',(req,res)=>{
  const id=req.body._id;

  Product.find({_id:id}).exec((err,data)=>{
    if(err)throw err;
   
    res.render('product_page',{data:data,style:'product_page.css'});

});

});


  module.exports=router;

