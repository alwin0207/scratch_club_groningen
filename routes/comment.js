//================================================================================
// Dependancies.
//================================================================================

var express = require("express"),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    User = require("../models/User.js"),
    ScrProject = require("../models/ScrProject.js"),
    Comment = require("../models/Comments.js");

//================================================================================
// Setting up dependancies
//================================================================================

var router = express.Router();

//================================================================================
// Create comment Routes
//================================================================================

// ------ Get ------ //

router.get("/fullproject/:id/add", isLoggedIn, function(req, res){
    res.render("addcomment.ejs");
});

// ------ Post ------ //

router.post("/fullproject/:id/add", isLoggedIn, function(req, res){
    
    // filling in comments model
    var commentNew = new Comment({
        text: req.body["text"],
        author: req.user.username,
        user: req.user
    });
    
    // save new comment to database + make a association in scrproject collection
    commentNew.save (function(err, comment){
        if (err){
            console.log(err);
            res.redirect("/projectspage");
        }
        else{
            ScrProject.findById(req.params.id, function(err, foundProject){
                if(err){
                    return console.log(err);
                }
                else{  
                    foundProject.comments.push(comment);
                    foundProject.save(function(err, foundProject){
                        if (err){
                            return console.log(err);
                        }
                        else{
                            User.findById(req.user, function(err, myUser){
                                if(err) {
                                    console.log(err);
                                    return res.redirect("/")
                                }
                                else{
                                    myUser.comments.push(comment);
                                    myUser.save(function(err, myUser){
                                        if (err){
                                            console.log(err);
                                            return res.redirect("/");
                                        }
                                        else{
                                            return res.redirect("/fullproject/"+req.params.id);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

//================================================================================
// Edit comment routes
//================================================================================

// ------ Get ------ //

router.get("/fullproject/:id/:id_comment/edit", isLoggedIn, function(req, res){
    Comment.findById(req.params.id_comment, function(err, foundComment){
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            console.log(req.user._id);
            console.log(foundComment.user);
            if((""+req.user._id)===(""+foundComment.user)){
                res.render("editcomment.ejs",{myComment:foundComment});
            }
            else{
                res.redirect("/projectspage");
            }
        }
    });
});

// ------ Post ------ //

router.post("/fullproject/:id/:id_comment/edit", isLoggedIn, function(req, res){
    var myProjectId = req.params.id;
    var myUpdate = {
        text: req.body["text"]
    };
    Comment.findById(req.params.id_comment, function(err, foundComment){
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            if(req.user.username===foundComment.author){
                console.log("fine");
                foundComment.update(myUpdate, function(err, foundComment){
                    if(err){
                        return console.log(err);
                    }
                    console.log(foundComment);
                    res.redirect("/fullproject/"+myProjectId);
                });
            }
            else{
                console.log("booohhh");
                res.redirect("/");
            }
            
        }
    });
});


//================================================================================
// Delete comment routes
//================================================================================

// ------ Get ------ //

router.get("/fullproject/:id/:id_comment/delete", isLoggedIn, function(req, res){
    Comment.findById(req.params.id_comment, function(err, foundComment){
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            if((""+req.user._id)===(""+foundComment.user)){
                res.render("deleteCheck.ejs", {myDelete: foundComment});
            }
            else{
                res.redirect("/");
            }
        }
    });    
});

// ------ Post ------ //

router.post("/fullproject/:id/:id_comment/delete", isLoggedIn, function(req, res){
    Comment.findById(req.params.id_comment, function(err, foundComment){
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            if((""+req.user._id)===(""+foundComment.user)){
                Comment.deleteOne(foundComment, function(err, deletedComment){
                    if (err){
                        console.log(err);
                        res.redirect("/");
                    }
                    else{
                        User.update({_id: foundComment.user}, {$pull: {comments: foundComment._id}}, function (err, commentsAffected) {
                            if (err){
                                console.log(err);
                                return res.redirect("/");
                            }
                            else{
                                console.log(commentsAffected);
                                ScrProject.update({_id: req.params.id}, {$pull: {comments: foundComment._id}}, function(err, commentsAffected){
                                    if(err){
                                        console.log(err);
                                        return res.redirect("/");
                                    }
                                    else{
                                        console.log(commentsAffected);
                                        res.redirect(( "/fullproject/" + req.params.id ));
                                    }
                                });
                            }
                        });
                    }    
                });
            }
        }
    });
});

//================================================================================
// Middleware
//================================================================================

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//================================================================================
// Export
//================================================================================

module.exports =router;