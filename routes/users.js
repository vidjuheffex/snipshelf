var express = require('express');
var router = express.Router();
var Snippet = require("../models/Snippet");
var User = require("../models/User");

router.use((req,res,next) => {
  if (!req.session.user){
    return res.redirect("/login");
  }
  return next();
});

router.delete('/', (req,res,next) => {
  User.findByIdAndRemove(req.session.user._id)
    .then( deletedUser => {
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});


router.get('/snippets', (req,res,next)=>{
  let searchObj = {
    user: req.session.user._id
  };

  if(req.query.filter){
    searchObj.language = req.query.filter;
  }

  if(req.query.tag){
    searchObj.tags = req.query.tag;
  }

  Snippet.find(searchObj)
    .then( snippets => {
      return res.render("snippets", {snippets: snippets});
    })
    .catch(err => {
      next(err);
    });
});

router.post('/snippets', (req,res,next)=>{
  console.log(req.body);
  let snippet = new Snippet({user: req.session.user._id,
                             title: req.body.title,
                             language: req.body.language,
                             document: req.body.document,
                             tags: req.body.tags
                            })
      .save()
      .then(result => {
        if(!result.errors)
          return res.redirect("/users/snippets");
        else
          return res.redirect("/users/createSnippet");
      })
      .catch(err => {
        next(err);
      });
});

router.delete("/snippets/:id", (req, res,next)=>{
  Snippet.findById(req.params.id)
    .then( snippet => {
      if (snippet.user == req.session.user._id){
        snippet.remove()
          .then(deletedSnippet => {
            return res.redirect("/users/snippets");
          })
          .catch(err=>{
            next(err);
          });
      }
      else {
        let err = new Error("You are not authorized to delete this message");
        next(err);
      }
    })
    .catch(err => {
      next(err);
    });
});
              

router.get('/createsnippet', (req,res,next)=>{
  res.render("createSnippet", {});
});

module.exports = router;
