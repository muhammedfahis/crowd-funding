var express = require('express');
var router = express.Router();
var User = require('../models/User');
var session = require('express-session');
var Product = require('../models/product');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const resizeimg = require('resize-img');
const multer = require('multer');
const path = require('path');


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



router.use(session({
  secret: 'ok',
  name: 'userCookie',
  saveUninitialized: false,
  resave: false,

  cookie: {
    maxAge: 60 * 1000 * 60 * 60 * 24 * 30
  }
}));


const userLoginChecker = (req, res, next) => {
  if (!req.session.email) {
    res.redirect('/users/login');
  } else {
    next();
  }
}

const DirectToDashboard = (req,res,next) =>{
  if(req.session.email){
    res.redirect('/users/landingpage');
  }else{
    next();
  }
}



router.get('/signup', (req, res) => {
  res.render('signup', { style: 'signup.css' });
});

router.post('/signup', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  if (password !== confirmPassword) {
    res.render('signup', { name: name, email: email, password: password });
  } else {


    var newUser = new User({
      email: email,
      name: name,
      password: password

    });
  }
  newUser.save();
  res.redirect('/users/login');
});




router.get('/login',DirectToDashboard, (req, res) => {
  res.render('login', { style: 'login.css' });
});
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email, password: password }).lean().exec((err, data) => {
    if (data) {
      var isLogged;

      req.session.email = email;

      Product.find({}).lean().exec((err, data) => {
        if (err) throw err;
        if (req.session.email) {
          isLogged = true
          res.render('landingpage', { isLogged, style: 'landingpage.css', data: data,email:req.session.email });
        }else{
          res.render('landingpage', {style: 'landingpage.css', data: data });
        }

      })

    } else {
      res.render('login', { msg: 'error', style: 'login.css' });
    }
  })
});
router.get('/forgotten', (req, res) => {
  res.render('forgotten', { style: 'forgotten.css' });
});

router.post('/forgotten', (req, res) => {
  const { email, password, confirmpassword } = req.body;

  if (password !== confirmpassword) {
    console.log('Enter same password');
    res.render('forgotten', { msg: 'wrong password', email: email, password: password });
  } else {
    User.updateOne({ email: email }, { $set: { password: password } }, (err) => {
      if (err) throw err;
    });
    res.redirect('/users/landingpage');

  }

});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('userCookie');
  res.redirect('/users/landingpage');
})

// categories

router.get('/art', (req, res) => {



  Product.find({ category: 'Arts' }).exec((err, data) => {
    if (err) throw err;
    var isLogged;
    if (req.session.email) {
      isLogged = true;
      res.render('landingpage', { data: data, style: 'landingpage.css', isLogged,email:req.session.email});
    }else{
      res.render('landingpage', { data: data, style: 'landingpage.css'});

    }


  })
});
router.get('/tech', (req, res) => {

  Product.find({ category: 'Tech' }).exec((err, data) => {
    if (err) throw err;
    var isLogged;
    if (req.session.email) {
      isLogged = true;
      res.render('landingpage', { data: data, style: 'landingpage.css', isLogged,email:req.session.email });
    }else{
      res.render('landingpage', { data: data, style: 'landingpage.css' });
    }


  })
});

router.get('/fashion', (req, res) => {



  Product.find({ category: 'Fashion' }).exec((err, data) => {
    if (err) throw err;
    var isLogged;
    if (req.session.email) {
      
      isLogged = true;
      res.render('landingpage', { data: data, style: 'landingpage.css', isLogged,email:req.session.email });
    }else{
      res.render('landingpage', { data: data, style: 'landingpage.css' });
    }


  })

});

router.get('/craft', (req, res) => {
  Product.find({ category: 'Craft' }).exec((err, data) => {
    if (err) throw err;
    var isLogged;
    if (req.session.email) {
      isLogged = true;
      res.render('landingpage', { data: data, style: 'landingpage.css', isLogged,email:req.session.email });
    }else{
      res.render('landingpage', { data: data, style: 'landingpage.css'});
    }


  });
});

// products



router.get('/start_project', (req, res) => {
  var isLogged;
  if (req.session.email) {
    isLogged = true;
    res.render('startProject', { style: 'start_project.css', isLogged,email:req.session.email });
  }else{
    res.render('startProject', { style: 'start_project.css' });
  }
});

router.get('/rules', userLoginChecker, (req, res) => {
  var isLogged;
  if (req.session.email) {
    isLogged = true;
    res.render('project_rules', { style: 'project_rules.css', isLogged,email:req.session.email });
  }else{
    res.render('project_rules', { style: 'project_rules.css' });
  }
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
      res.redirect('/users/landingpage')
    }
  });
});


// router.get('/upload_photo', (req, res) => {
//   res.render('photoUpload', { style: 'photo_upload.css' });
// });




router.get('/landingpage', (req, res) => {
  Product.find({}).exec((err, data) => {
    if (err) throw err;
    var isLogged;

    if (req.session.email) {
      isLogged = true;
      res.render('landingpage', { data: data, style: 'landingpage.css', isLogged,email:req.session.email });
    }else {
      res.render('landingpage', { data: data, style: 'landingpage.css'});
    }



  })
});



router.get('/items/:id', (req, res) => {
  const id = req.params.id;
  Product.find({ _id: id }).exec((err, data) => {
    if (err) throw err;

    if (req.session.email) {
      var isLogged = true;
      res.render('product_page', { data: data, style: 'product_page.css', isLogged,email:req.session.email });
    }else{
      res.render('product_page', { data: data, style: 'product_page.css' });
    }




  })
});


router.get('/comments/:id', (req, res) => {
  const id = req.params.id;
  Product.find({ _id: id }).exec((err, data) => {
    if (err) throw err;
    var isLogged;
    if (req.session.email) {
      isLogged = true;
      res.render('commentPage', { data: data, style: 'commentPage.css', isLogged,email:req.session.email });
    }else {
      res.render('commentPage', { data: data, style: 'commentPage.css'});
    }


  })
});

router.post('/comments', (req, res) => {


  console.log(req.body._id);
  console.log(req.body.comment);


  Product.updateOne({ _id: req.body._id }, { $push: { comments: req.body.comment, username: req.body.username, Date: Date.now() } }, ((err, data) => {
    if (err) throw err;

    Product.find({ _id: req.body._id }).lean().exec((err, data) => {
      if (err) throw err;
      var isLogged;
      if (req.session.email) {
        isLogged = true;
        res.render('commentPage', { data: data, style: 'product_page.css', isLogged,email:req.session.email });
      }else{
        res.render('commentPage', { data: data, style: 'product_page.css' });
      }



    })

  }));





})










module.exports = router;
