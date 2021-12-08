var express = require('express');
var Article = require("../models/article");
var Comment = require("../models/comment")
var auth = require("../middlewares/auth");
var router = express.Router();

/* GET articles listing. */
router.get('/', auth.isUserLoggedIn, function (req, res, next) {
    Article.find({}, (err, articlesList) => {
        if (err) return next(err);
        res.render("articles", { articlesList: articlesList });
    })
});
router.get('/new', auth.isUserLoggedIn, function (req, res, next) {
    res.render("articleForm");

});
//submit 
router.post('/', auth.isUserLoggedIn, function (req, res, next) {
    var { title, description, author } = req.body;
    Article.create(req.body, (err, articleAdd) => {
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
router.get('/:id',auth.isUserLoggedIn, function (req, res, next) {
    var id = req.params.id;
    Article.findById(id
    ).populate('comments').exec((err, article) => {
        if (err) return next(err);
        console.log(article);
        res.render("articlesDetail", { article })
    })
});
//edit
router.get('/:id/edit',auth.isUserLoggedIn, function (req, res, next) {
    var id = req.params.id;
    Article.findById(id, (err, article) => {
        if (err) return next(err);
        res.render("articleUpdateForm", { article: article })
    })
});
//update 
router.post('/:id',auth.isUserLoggedIn, function (req, res, next) {
    var id = req.params.id;
    Article.findByIdAndUpdate(id, req.body, (err, article) => {
        if (err) return next(err);
        res.redirect("/articles")
    })
});
//delete
router.get("/:id/delete",auth.isUserLoggedIn, (req, res) => {
    var id = req.params.id;
    Article.findByIdAndDelete(id, (err, article) => {
        if (err) return next(err);
        Comment.deleteMany({ articleId: article.id }, (err, comment) => {
            res.redirect("/articles")
        })
    })
})

//like
router.get("/:id/likes", (req, res) => {
    if (!req.session.userId) {
        req.flash("error", "User is not logged in")
        return res.redirect("/users/login")
    }
    var id = req.params.id;
    Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
        if (err) return next(err);
        res.redirect("/articles/" + id)
    })
})

//comments
router.post("/:id/comments", (req, res) => {
    if (!req.session.userId) {
        req.flash("error", "User is not logged in")
        return res.redirect("/users/login")
    }
    var id = req.params.id;
    req.body.articleId = id;
    Comment.create(req.body, (err, comment) => {
        if (err) return next(err);
        Article.findByIdAndUpdate(id, { $push: { comments: comment.id } }, (err, comment) => {
            if (err) return next(err);
            res.redirect("/articles/" + id)
        })
    })
})




module.exports = router;