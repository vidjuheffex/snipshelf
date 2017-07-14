var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var pwd = require('pwd');
var User = require('../models/User');
var signupValidator = require('../validators/validator-signup');

router.use(expressValidator());

function hashPass(req,res,next){
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {});
});

router.get('/login', (req,res,next) => {
  res.render('login', {});
});

router.post('/login', (req,res, next)=>{
  return User.findOne({username: req.body.username})
    .then(user => {
      if(user){
        return pwd.hash(req.body.password, user.salt)
          .then(result => {
            if(user.hash == result.hash){
              req.session.user = user;
              return res.redirect("/users/snippets");
            }
            else
              return res.redirect("login");
          });           
      }
      else
        return res.redirect("/login");
    });
});

router.get('/signup', (req,res,next)=>{
  res.render('signup', {});
});

router.post('/signup', (req,res,next) => {
  req.checkBody(new signupValidator(req.body.passwordConfirm));
  req.getValidationResult()
    .then(result => {
      if (result.array().length == 0) {
        return createAccount(req.body.username, req.body.password)
          .then(result => {
            return res.redirect("/login");
          })
          .catch(err => {
            return res.redirect("/signup");
          });
      }
      else {
        return res.redirect("/signup");
      }
    })
    .catch(err => {
      next(err);
    });
});


function createAccount(username, password){
  return pwd.hash(password)
    .then(result => {
      let user = new User({username: username, hash: result.hash, salt: result.salt});
      return user.save();
    })
    .catch(err => {
      throw err;
    });
}


module.exports = router;
