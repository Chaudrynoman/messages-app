const express = require('express');
const router = express.Router();
const passport = require('passport');
const initializePassport = require('../config/passport-config');
const isauth=require('../middleware/is-auth');
const {userSchema} = require('../model/user.js');
const session = require('express-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');

require('../config/auth');//for google
require('../config/fauth');//for facebook

const users = [];
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

router.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  }));
// router.use(passport.initialize());
// router.use(passport.session());
router.use(methodOverride('_method'));

//facebook
router.use(passport.initialize());
router.use(passport.session());



router.use('/login/fb', (req, res) => {
  res.send('<a href="/fb">Authenticate with facebook</a>');
});

router.get('/fb',passport.authenticate( 'facebook', {successRedirect: '/',failureRedirect: '/auth/google/failure'}), (req, res) => {
  // res.send(`Hello ${req.user.displayName}`);
});

//<<end fb

//googlr
router.get('/google', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  });
  
  router.get('/auth/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ] }
  ));
//facebook added passport.authentication
//passport.authenticate('facebook',{failureRedirect: '/failed/login'})

//google passport.authenticate( 'google', {successRedirect: '/protected',failureRedirect: '/auth/google/failure'})

// router.get('/', checkAuthenticated, (req, res) => {
//     res.render('index.ejs', { name: req.user.name })
//   })
  
  router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  });
  
  router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
  
  router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  });
  
  router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        console.log(req.body.passport);
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user=await userSchema.find({email:req.body.email});
      if(user.length>0){
        //user already save in mongodb
      }
      else{
        const newuser=new userSchema({
          id: Date.now().toString(),
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        });
        newuser.save();
      }
      users.push({
        id: Date.now().toString(),
        displayName: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  });
  
  // function checkAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return next()
  //   }
  
  //   res.redirect('/login')
  // }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  };

//google middleware as

router.get('/protected',passport.authenticate( 'google', {successRedirect: '/',failureRedirect: '/auth/google/failure'}), (req, res) => {
    // res.send(`Hello ${req.user.displayName}`);
  });
  
  router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Goodbye!');
  });
  
  router.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
  });

  router.get("/", isauth, (req, res) => {
    console.log(`request done by ${process.pid}`);
    console.log(req.user);
    res.render("start",{name: req.user.name});
    // cluster.worker.kill();
});

  module.exports = router;