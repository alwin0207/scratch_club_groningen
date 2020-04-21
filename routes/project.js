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
// Under construction route
//================================================================================

    router.get("/under_construction", function(req, res){
        res.render("under_construction.ejs");
    });

//================================================================================
// View Projectspage routes
//================================================================================

router.get("/projectspage", function(req, res){
    
    // ... reading projects from database and rendering those projects ...
    ScrProject.find(function (err, scrProjects) {
        if (err) return console.error(err);
        if (req.isAuthenticated()){  // update: added authentication check for diverent content. Now the original link is sending to the original path where isAuthenticated middleware kicks in therefore never sending you to that page.
            res.render("projectspage_v1_2_test.ejs", {
            projectlist: scrProjects, showCreateProject: true
            });
        }
        else{
            res.render("projectspage_v1_2_test.ejs", {
            projectlist: scrProjects, showCreateProject: false
            });
        }
    });
});

//================================================================================
// View full Project routes
//================================================================================

router.get("/fullproject/:id", function(req, res){

    ScrProject.findById(req.params.id).populate("comments").exec(function (err, foundProject){
        if (err){
            console.log(err);
        }
        else{
            if (req.isAuthenticated()){
                var showExtra = false;
                if("" + req.user._id === ""+foundProject.user._id){
                    showExtra = true;
                }
                else{
                    showExtra = false;
                }
                
                    User.findById(req.user._id, function(err, currentUser){
                        if(err){
                            console.log(err);
                        }
                        else{
                            var userCommentList = currentUser.comments;
                            res.render("fullproject_v1_3.ejs",{myProject: foundProject, showCreateProject: showExtra, userCommentList:userCommentList}); 
                        }
                    });
                
            }
            else{
                res.render("fullproject_v1_3.ejs",{myProject: foundProject, showCreateProject: showExtra, userCommentList: [""]}); 
            }
        }
    });
});

//================================================================================
// Create Project routes
//================================================================================

// ------ Get ------ //

router.get("/addform", isLoggedIn, function(req, res){
    res.render("addform.ejs");
});

// ------ Post ------ //

router.post("/add_projectb", isLoggedIn, function(req, res){
    // ... restructuring post body to correct object ...
    var scrProjectNew = new ScrProject({
        user: req.user._id,
        name: req.body["name"],
        age: req.body["age"],
        scrProjectName: req.body["prName"],
        scrCards: req.body["prCards"],
        scrImage: req.body["prImage"],
        scrProjectDes: req.body["prDesc"],
        scrProjectTheme: req.body["prTheme"]
    });

    // ... add restructured bodyobject to database and open projectpage ...
    scrProjectNew.save (function(err, scrProject){
        if (err){
            console.log(err);
            res.redirect("/projectspage");
        }
        else{
            User.findById(req.user, function(err, myUser){
                if(err) {
                    console.log(err);
                    return res.redirect("/")
                }
                else{
                    myUser.projects.push(scrProject);
                    myUser.save(function(err, foundProject){
                        if (err){
                            console.log(err);
                            return res.redirect("/");
                        }
                        else{
                            return res.redirect("/projectspage")
                        }
                    });
                }
            });
        }
    });
});

router.get("/mytest", function(req, res){
    var userLoggedIn = true;
    res.render("popuptest.ejs", {userLoggedIn:userLoggedIn});
});

//================================================================================
// Edit Project routes
//================================================================================

// ------ Get ------ //

router.get("/fullproject/:id/edit", isLoggedIn, function(req, res){
    ScrProject.findById(req.params.id, function(err, foundProject){
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            var requestID= ""+req.user._id;
            var projectID= ""+foundProject.user;
            if(requestID === projectID){
                res.render("editproject.ejs",{myProject:foundProject});
            }
            else{
                res.redirect("/projectspage");
            }
        }
    });
});

// ------ Post ------ //

router.post("/fullproject/:id/edit", isLoggedIn, function(req, res){
    var myProjectUpdate = {
        name: req.body["name"],
        age: req.body["age"],
        scrProjectName: req.body["prName"],
        scrCards: req.body["prCards"],
        scrImage: req.body["prImage"],
        scrProjectDes: req.body["prDesc"],
        scrProjectTheme: req.body["prTheme"]
    }

    ScrProject.findById(req.params.id, function(err, foundProject){
        var requestID= ""+req.user._id;
        var projectID= ""+foundProject.user;
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            if(requestID === projectID){
                foundProject.updateOne(myProjectUpdate, function(err, foundProject){
                    if(err){
                        return console.log(err);
                    }
                    else{
                        res.redirect("/fullproject/"+(req.params.id));
                    }
                });
            }
            else{
                res.redirect("/");
            } 
        }
    });    
});

//================================================================================
// Delete Project routes  (nog aanpassen naar project)
//================================================================================

router.get("/fullproject/:id/delete", isLoggedIn, function(req, res){
    ScrProject.findById(req.params.id, function(err, foundProject){
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            if((""+req.user._id)===(""+foundProject.user)){
                res.render("deleteCheck.ejs", {myDelete: foundProject});
            }
            else{
                res.redirect("/");
            }
        }
    });    
});

// ------ Post ------ //

router.post("/fullproject/:id/delete", isLoggedIn, function(req, res){
    ScrProject.findById(req.params.id).exec(function(err, foundProject){
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            if((""+req.user._id)===(""+foundProject.user)){
                ScrProject.deleteOne(foundProject).exec(function(err, deletedProject){
                    console.log(foundProject);
                    console.log(deletedProject);
                    if (err){
                        console.log(err);
                        res.redirect("/");
                    }
                    else{
                        User.update({_id: foundProject.user}, {$pull: {projects: foundProject._id }}, function (err, projectsAffected) {
                            console.log(projectsAffected);
                            if (err){                                            
                                console.log(err);
                                return res.redirect("/");
                            }
                            else{
                                res.redirect("/projectspage");
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


//User.updateMany({user: {$in: foundProject.comments}}, {$pull: {comments: {_id: {$in: foundProject.comments}}}}, function(err, otherComments){});



//================================================================================
// Export
//================================================================================

module.exports =router;