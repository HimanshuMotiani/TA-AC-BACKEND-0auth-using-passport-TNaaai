var express = require('express');
var Article = require("../models/article");
var Comment = require("../models/comment")
var router = express.Router();

/* GET articles listing. */
router.get('/', function(req, res, next) {
    console.log(req.session.passport.user , req.session.userId);
    if(req.session.userId || req.session.passport.user){
        Article.find({},(err,articlesList)=>{
            if(err) return next(err);
            res.render("articles",{articlesList : articlesList });
        })
    }
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    
});
router.get('/new', function(req, res, next) {
    if(req.session.userId || req.session.passport.user){
    return res.render("articleForm"); 
    }
    req.flash("error","User is not logged in")
    return res.redirect("/users/login")
});
//submit 
router.post('/', function(req, res, next) {
    var { title,description,author } = req.body;
  Article.create(req.body,(err,articleAdd)=>{
      res.redirect("/articles")
})
})
// router.get('/:id', function(req, res, next) {
//     var id = req.params.id;
//     Article.findById(id,(err,article)=>{
//         if(err) return next(err);
//         Comment.find({articleId:id},(err,comments)=>{
//             res.render("articlesDetail",{article,comments})
//         })
//   })
// });

// or using populate
// get detail
router.get('/:id', function(req, res, next) {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    var id = req.params.id;
    Article.findById(id
        ).populate('comments').exec((err,article)=>{
        if(err) return next(err);
            res.render("articlesDetail",{article})
        })
  });
//edit
router.get('/:id/edit', function(req, res, next) {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    var id = req.params.id;
    Article.findById(id,(err,article)=>{
        if(err) return next(err);
        res.render("articleUpdateForm",{article:article})
  })
});
//update 
router.post('/:id', function(req, res, next) {
    var id = req.params.id;
    Article.findByIdAndUpdate(id,req.body,(err,article)=>{
        if(err) return next(err);
        res.redirect("/articles")
  })
});
//delete
router.get("/:id/delete", (req, res) => {
    if(!req.session.userId){
        req.flash("error","User is not logged in,log in first")
        return res.redirect("/users/login")
    }
    var id = req.params.id;
    Article.findByIdAndDelete(id, (err, article) => {
        if (err) return next(err);
        Comment.deleteMany({articleId:article.id},(err,comment)=>{
            res.redirect("/articles")
        })
    })
})

//like
router.get("/:id/likes", (req, res) => {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    var id = req.params.id;
    Article.findByIdAndUpdate(id,{$inc:{likes:1}} ,(err, article) => {
        if (err) return next(err);
        res.redirect("/articles/"+id)
    })
})

//comments
router.post("/:id/comments", (req, res) => {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    var id = req.params.id;
    req.body.articleId = id;
    Comment.create(req.body,(err,comment)=>{
        if (err) return next(err);
        Article.findByIdAndUpdate(id,{$push:{comments:comment.id}},(err,comment)=>{
            if (err) return next(err);  
            res.redirect("/articles/"+ id)
        })
    })
})




module.exports = router;