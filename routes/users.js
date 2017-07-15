var express = require('express');
var router = express.Router();
var Snippet = require("../models/Snippet");

router.use((req,res,next) => {
  if (!req.session.user){
    return res.redirect("/login");
  }
  return next();
});

router.get('/snippets', (req,res,next)=>{
  res.render("snippets", {});
});

router.post('/snippets', (req,res,next)=>{
  let snippet = new Snippet({user: req.session.user._id,
                             title: req.body.title,
                             language: req.body.language,
                             document: req.body.document
                            })
      .save()
      .then(result => {
        if(!result.errors)
          return res.redirect("/users/snippets");
        else
          return res.redirect("/users/createSnippet");
      })
      .catch(err => {
        throw err;
      });
});

router.get('/createsnippet', (req,res,next)=>{
  res.render("createSnippet", {});
});

module.exports = router;
