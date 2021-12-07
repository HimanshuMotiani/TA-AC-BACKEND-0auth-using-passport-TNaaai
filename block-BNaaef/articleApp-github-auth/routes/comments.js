var express = require("express");
var router = express.Router();
var Comment = require("../models/comment");
var Article = require("../models/article")

router.get("/:id/edit",(req,res)=>{
var id = req.params.id
Comment.findById(id,(err,comment)=>{
    if(err) return next(err);
    res.render("updateComment",{comment})
})
})
router.post("/:id",(req,res)=>{
    var id = req.params.id
    Comment.findByIdAndUpdate(id,req.body,(err,updatedComment)=>{
        if(err) return next(err);
        res.redirect("/articles/"+ updatedComment.articleId)
    })
})
router.get("/:id/delete",(req,res)=>{
    var id = req.params.id
    Comment.findByIdAndRemove(id,(err,comment)=>{
        if(err) return next(err);
        Article.findByIdAndUpdate(comment.ArticleId,{$pull:{comments:comment._id}},(err,article)=>{
            res.redirect("/articles/"+ comment.articleId)
        })
        
    })
})

//likes
router.get("/:id/likes",(req,res)=>{
    var id = req.params.id;
    Comment.findByIdAndUpdate(id,{$inc:{likes:1}},(err,comment)=>{
        if(err) return next(err);
        res.redirect("/articles/"+ comment.articleId)
    })
})
module.exports = router