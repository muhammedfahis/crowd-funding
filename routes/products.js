const express=require('express');
const router=express.Router();
const Product=require('../models/product');
const fs=require('fs-extra');
const mkdirp=require('mkdirp');
const resizeimg=require('resize-img');
const multer=require('multer');
const path=require('path');
const upload=require('express-fileupload');







router.get('/start_project',(req,res)=>{
  res.render('startProject',{style:'start_project.css'});
});

router.get('/rules',(req,res)=>{
  res.render('project_rules',{style:'project_rules.css'});
});



router.post('/project_upload',(req,res)=>{

  
    const newProduct=new Product({
      category:req.body.category,
      country:req.body.country,
      discription:req.body.discription,
      checkbox_1:req.body.checkbox_1,
      checkbox_2:req.body.checkbox_2,
      price:req.body.price,
      target:req.body.target,
     
    });
 
   newProduct.save()
   res.redirect('/products/upload_photo')

  });


router.get('/upload_photo',(req,res)=>{
  res.render('photoUpload',{style:'photo_upload.css'});
});

router.post('/upload_photo',(req,res)=>{

  if(req.files){
    var imagefile=req.files.image;
    var videofile=req.files.video

    var videoname=videofile.name
    var imagename=imagefile.name

    imagefile.mv('./uploads/'+imagename,(err)=>{
      if(err) throw err;
    })
    }
    console.log(imagename);

    const newPhoto=new Product({
      img:req.files.image,
      video:req.files.video
    })
    newPhoto.save();
})


router.get('/landingpage',(req,res)=>{
  Product.find({}).lean().exec((err,data)=>{
    if(err) throw err;
    console.log (data)
    
    res.render('landingpage',{data:data,style:'landingpage.css'});
  })
})




  module.exports=router;

