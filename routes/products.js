const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const resizeimg = require('resize-img');
const multer = require('multer');
const path = require('path');
const session= require( 'express-session');
const userLoginChecker= require('./users');




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



router.get('/start_project', (req, res) => {
  res.render('startProject', { style: 'start_project.css' });
});

router.get('/rules', userLoginChecker, (req, res) => {
  res.render('project_rules', { style: 'project_rules.css' });
});



router.post('/project_upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(req.file.path);

      var filename = req.file.filename

      const newProduct = new Product({
        category: req.body.category,
        country: req.body.country,
        discription: req.body.discription,
        checkbox_1: req.body.checkbox_1,
        checkbox_2: req.body.checkbox_2,
        price: req.body.price,
        target: req.body.target,
        details: req.body.details,
        img: filename

      });

      // if(newProduct.checkbox_1 != 'on' && newProduct.checkbox_2 != 'on'){
      //   res.render('')
      // }
      newProduct.save()
    }
  });
});


router.get('/upload_photo', (req, res) => {
  res.render('photoUpload', { style: 'photo_upload.css' });
});




router.get('/landingpage', (req, res) => {
  Product.find({}).exec((err, data) => {
    if (err) throw err;

    res.render('landingpage', { data: data, style: 'landingpage.css' });
  })
});



router.get('/items/:id', (req, res) => {
  const id = req.params.id;
  Product.find({ _id: id }).exec((err, data) => {
    if (err) throw err;

    res.render('product_page', { data: data, style: 'product_page.css' });

  })
});


router.get('/comments/:id', (req, res) => {
  const id = req.params.id;
  Product.find({ _id: id }).exec((err, data) => {
    if (err) throw err;
    res.render('commentPage', { data: data, style: 'commentPage.css' });
  })
});

router.post('/comments',(req,res)=>{
  
  
  console.log(req.body._id);
  console.log(req.body.comment);

  // var commentDate = new Date(Date.now());
  // commentDate = commentDate.toDateString();
  Product.updateOne({_id:req.body._id},{$push:{comments:req.body.comment,username:req.body.username,Date:Date.now()}},((err,data)=>{
    if(err) throw err;

  Product.find({_id:req.body._id}).lean().exec((err,data)=>{
    if(err) throw err;
    
    res.render('commentPage',{data:data,style:'product_page.css'});
  })

  }));





})








module.exports = router;

