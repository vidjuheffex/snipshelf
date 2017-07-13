var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var pwd = require('pwd');
var User = require('../models/User');

router.use(expressValidator());

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {});
});

router.get('/login', (req,res,next) => {
  res.render('login', {});
});

router.post('login', (req,res, next)=>{
  let username = req.body.username;
  let password = req.body.password;
});

router.get('/signup', (req,res,next)=>{
  res.render('signup', {});
});

router.post('/signup', (req,res,next) => {
  req.checkBody({'password':
                 {
                   notEmpty: {
                     options: true,
                     errorMessage: "Password can't be empty."
                   },
                   matches: {
                     options: [ req.body.passwordConfirm ],
                     errorMessage: "Passwords don't match"
                   }
                 }
                });
  req.getValidationResult()
    .then(result => {
      if (result.array().length == 0) {
        createAccount(req.body.username, req.body.password, res)
          .then(result => {
            res.redirect("/login");
          })
          .catch(err => {
            res.redirect("/signup");
          });
      }
      else {
        res.redirect("/signup");
      }
    });
});


function createAccount(username, password, res){
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
