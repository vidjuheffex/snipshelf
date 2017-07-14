var express = require('express');
var router = express.Router();

router.use((req,res,next) => {
  if (!req.session.user){
    return res.redirect("/login");
  }
  return next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/snippets', (req,res,next)=>{
  res.send("hey");
});

module.exports = router;
