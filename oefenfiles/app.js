// ------ Adding dependancies ------
var express =    require("express"),
    bodyParser = require("body-parser"),
    mongoose =   require("mongoose"),
    expressSession = require("express-session"),
    passport = require('passport'),
    User = require("./models/User.js"),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require("passport-local-mongoose"),
    ScrProject = require("./models/ScrProject.js"),
    Comment = require("./models/Comments.js");



/* ------ Setting up dependancies and connections ------ */
// ... express ...   
var app = express();
// ... mongoose ...
mongoose.connect('mongodb://localhost/scratchprojectsdb', {useNewUrlParser: true});
// ... bodyparser ...
app.use(bodyParser.urlencoded({extended: true}));
// ... passport ...
app.use(expressSession(
    {
        secret: "dit is best wel gek heh",
        resave: false,
        saveUninitialized: false
    }
));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//... adding user info to all routes ...
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    console.log(res.locals.currentUser);
    next();
});
// ... static files ...
app.use(express.static('stylesheets'));

////////////////////////////////////////////////////////////////////////////////////
// ......------ Middelware (check if visitor is logged in)------......

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


////////////////////////////////////////////////////////////////////////////////////

/* ------ Server Routes ------ */


// ------...... index route ......------
app.get("/",function(req, res){
    res.render("landing.ejs");
});

//------......register routes ......------
app.get("/register", function(req, res){
    res.render("registerform.ejs");
});

app.post("/register", function(req, res){
    console.log(req.body.password)
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
//------......login route ......------

app.get("/login", function(req, res){
    res.render("loginpage.ejs");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/projectspage",
    failureRedirect: "/register"
}),function(req,res){

}); 


// ------...... add project form route ......------
app.get("/addform", isLoggedIn, function(req, res){
    res.render("addform.ejs");
});

// ------...... projectpage route ......------
app.get("/projectspage", function(req, res){
    

    // ... reading projects from database and rendering those projects ...
    ScrProject.find(function (err, scrProjects) {
        if (err) return console.error(err);
        res.render("projectspage.ejs", {
            projectlist: scrProjects
        });
    });
});

app.get("/fullproject/:id/edit", isLoggedIn, function(req, res){
    ScrProject.findById(req.params.id, function(err, foundProject){
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            res.render("editproject.ejs",{myProject:foundProject});
        }
    });
});

app.post("/fullproject/:id/edit", isLoggedIn, function(req, res){
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
                console.log("fine");
                foundProject.update(myProjectUpdate, function(err, foundProject){
                    if(err){
                        return console.log(err);
                    }
                    console.log(foundProject);
                    res.redirect("/fullproject/"+(req.params.id));
                });
            }
            else{
                console.log("booohhh");
                console.log(req.user._id);
                console.log(foundProject.user);
                res.redirect("/");
            }
            
        }
    });

    
});
// ------...... add project to database post route ......------
app.post("/add_projectb", isLoggedIn, function(req, res){
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
            console.log("booohhhh");
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
            /*ScrProject.find(function (err, scrProjects) {
                if (err) return console.error(err);
            });
            res.redirect("/projectspage");*/
        }
    });
});

// ------...... Post route comment  ......------
app.post("/fullproject/:id/add", isLoggedIn, function(req, res){
    
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
                                console.log("found user");
                                console.log(myUser);
                                if(err) {
                                    console.log(err);
                                    return res.redirect("/")
                                }
                                else{
                                    myUser.comments.push(comment);
                                    myUser.save(function(err, myUser){
                                        console.log("pushed comment")
                                        console.log(myUser);
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

// ------...... Get edit page comment ......------

/////////////////////////////////////////////////////////////////////////////////////

// !!!!!!!!!!!!!!!!!!!!!  give permissions (to do) !!!!!!!!!!!!!!!
app.get("/fullproject/:id/:id_comment/edit", isLoggedIn, function(req, res){
    Comment.findById(req.params.id_comment, function(err, foundComment){
        if (err){
            console.log(err);
            return res.redirect("/");
        }
        else{
            res.render("editcomment.ejs",{myComment:foundComment});
        }
    });
});

app.post("/fullproject/:id/:id_comment/edit", isLoggedIn, function(req, res){
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

////////////////////////////////////////////////////////////////////////////

// ------...... Get route add comment page ......------

app.get("/fullproject/:id/add", isLoggedIn, function(req, res){
    var projectId = req.params;
    console.log("Lukt het openen?");
    console.log(projectId);
    res.render("addcomment.ejs");

});

// ------...... Get route full project page ......------

app.get("/fullproject/:id", function(req, res){

    ScrProject.findById(req.params.id).populate("comments").exec(function (err, foundProject){
        if (err){
            console.log(err);
        }
        else{
            res.render("fullproject_v1_2.ejs",{myProject: foundProject}); 
        }
    });
});


/* ------ Start Listening to server ------ */
app.listen(3000, function(){
    console.log("scratch server is listening");
});

/* Need to add: a check for empty forms */