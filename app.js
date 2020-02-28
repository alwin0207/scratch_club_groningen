// ------ Adding dependancies ------
var express =    require("express"),
    bodyParser = require("body-parser"),
    mongoose =   require("mongoose");



/* ------ Setting up dependancies and connections ------ */
// ... express ...   
var app = express();
// ... mongoose ...
mongoose.connect('mongodb://localhost/scratchprojectsdb', {useNewUrlParser: true});
// ... bodyparser ...
app.use(bodyParser.urlencoded({extended: true}));
// ... static files ...
app.use(express.static('stylesheets'));

// ------ Setting up mongoose model and schema ------
// ... Schema ...
var scrProjectSchema = new mongoose.Schema({
    name: String,
    age: Number,
    scrProjectName: String,
    scrCards: String,
    scrImage: String,
    scrProjectDes: String,
    scrProjectTheme: String
});
// ... Model ...
var ScrProject = mongoose.model("ScrProject", scrProjectSchema);


/* ------ Server Routes ------ */

// ... index route ......
app.get("/",function(req, res){
    res.render("landing.ejs");
});

// ... add project form route ...
app.get("/addform",function(req, res){
    res.render("addform.ejs");
});

// ... projectpage route ...
app.get("/projectspage", function(req, res){
    
    var databaseObject;

    // ... reading projects from database and rendering those projects ...
    ScrProject.find(function (err, scrProjects) {
        if (err) return console.error(err);
        databaseObject = scrProjects;
        res.render("projectspage.ejs", {projectlist: databaseObject});
      });
});

// ... add project to database post route ...
app.post("/add_projectb", function(req, res){
    // ... restructuring post body to correct object ...
    var scrProjectNew = new ScrProject({
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
            ScrProject.find(function (err, scrProjects) {
                if (err) return console.error(err);
              });
              res.redirect("/projectspage");
        }
    });

});

/* ------ Start Listening to server ------ */
app.listen(3000, function(){
    console.log("scratch server is listening");
});

/* Need to add: a check for empty forms */