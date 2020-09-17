const express=require('express');
const router=express.Router();
const Product=require('../models/product');






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
      image:req.body.image,
      video:req.body.video
    });
    console.log(req.body.image);
    console.log(req.body.video);
    console.log(req.body.target);

    newProduct.save((err)=>{
      if(err) throw err;
    });
  

});


router.get('/landingpage',(req,res)=>{
  Product.find({}).lean().exec((err,data)=>{
    if(err) throw err;
    console.log(data);
    res.render('landingpage',{data:data,style:'landingpage.css'});
  })
})




  module.exports=router;

