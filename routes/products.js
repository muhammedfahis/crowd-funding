const express=require('express');
const router=express.Router();
const Product=require('../models/product');






router.get('/start_project',(req,res)=>{
  res.render('startProject',{style:'start_project.css'});
});

router.get('/rules',(req,res)=>{
  res.render('project_rules',{style:'project_rules.css'});
});



router.post('/start_project',(req,res)=>{
  const{category,country,discription,checkbox_1,checkbox_2,price,target,image,video}=req.body;
  

});


router.get('/landingpage',(req,res)=>{
  Product.find({}).lean().exec((err,data)=>{
    if(err) throw err;
    console.log(data);
    res.render('landingpage',{data:data,style:'landingpage.css'});
  })
})




  module.exports=router;

