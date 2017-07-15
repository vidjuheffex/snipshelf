var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var pwd = require('pwd');
var User = require('../models/User');
var signupValidator = require('../validators/validator-signup');
var SimpleError = require('../utils/simple-error');

router.use(expressValidator());

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {});
});

router.get('/login', (req,res,next) => {
  res.render('login', {errors: req.session.sessionErrObj});
});

router.post('/login', (req,res, next)=>{
  let sessionErrObj = SimpleError.create();
  req.session.sessionErrObj = sessionErrObj;
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
              sessionErrObj.createOrUpdateProperty("password", "Password incorrect");
            return res.redirect("login");
          });           
      }
      else
        sessionErrObj.createOrUpdateProperty("username", "Username not found");
        return res.redirect("/login");
    })
    .catch(err => {
      next(err);
    });
});

router.get('/signup', (req,res,next)=>{
  res.render('signup', {errors: req.session.sessionErrObj});
});

router.post('/signup', (req,res,next) => {
  let sessionErrObj = SimpleError.create();
  req.session.sessionErrObj = sessionErrObj;
  req.checkBody(new signupValidator(req.body.passwordConfirm));
  req.getValidationResult()
    .then(result => {
      if (result.array().length == 0) {
        return createAccount(req.body.username, req.body.password)
          .then(result => {
            if(!result.errors)
              return res.redirect("/login");
            else {
              for (let x in result.errors){
                sessionErrObj.createOrUpdateProperty(x, result.errors[x].properties.message);
              }
              return res.redirect("/signup");
            }
          })
          .catch(err => {
            next(err);
          });
      }
      else {
        for (let x in result.mapped()){
          sessionErrObj.createOrUpdateProperty(x, result.mapped()[x].msg);
        }
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
      return err;
    });
}


module.exports = router;
