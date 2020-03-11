//require rijtje
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
User = require("./user/exclusive");
passportLocalMongoose = require("passport-local-mongoose");
expressSession = require("express-session"); // mag hier misschien niet


// 

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession( // ja misschien moet je hier volledig in
    {
        secret: "dit is best wel gek heh",
        resave: false,
        saveUninitialized: false
    }
));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// Binnen route:

User.register(new User({username: req.body.username}), req.body.passport, function(err, user){
    // error handling
    // passport.authenticate
});

// Binnen User.js:

passportLocalMongoose = require("passport-local-mongoose");

mySchema.pluggin(passportLocalMongoose); // mySchema wordt de userschema


// route example:

app.post("/login", passport.authenticate("local", {
    succesRedirect: "/secret",
    failureRedirect: "/nopepage"
}),function(err, user){});

// logout:

req.logout();

// for login check use middleware: post("/route", middleware(), callback(){});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/failureroute");
    }
}