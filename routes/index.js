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
// Index Routes
//================================================================================

router.get("/",function(req, res){
    res.render("landing.ejs");
});

//================================================================================
// Register routes
//================================================================================

// ------ Get ------ //
router.get("/register", function(req, res){
    res.render("registerform.ejs");
});

// ------ Post ------ //
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, function() {
                res.redirect("/projectspage");
            });
        }
    });
}); 

//================================================================================
// Login routes
//================================================================================

// ------ Get ------ //

router.get("/login", function(req, res){
    res.render("loginpage.ejs");
});

// ------ Post ------ //

router.post("/login", passport.authenticate("local", {
    successRedirect: "/projectspage",
    failureRedirect: "/register"
}),function(req,res){}); 

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