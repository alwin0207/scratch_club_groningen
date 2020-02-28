var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/scratchprojectsdb', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('stylesheets'));

// -------------------------------------------------
var scrProjectSchema = new mongoose.Schema({
    name: String,
    age: Number,
    scrProjectName: String,
    scrCards: String,
    scrImage: String,
    scrProjectDes: String,
    scrProjectTheme: String
});

var ScrProject = mongoose.model("ScrProject", scrProjectSchema);
// -------------------------------------------------

/* -- Start -->  Temporary data for pages <-- Start -- */

var projectlist = [
    {name:"Kelly", age: 8, projectName: "kleurboek", image: "image in here"},
    {name:"Bas", age: 19, projectName: "robot", image: "image in here"},
    {name:"Jaylon", age: 9, projectName: "animatie", image: "image in here"},
    {name:"Keke", age: 9, projectName: "moederdagkaart", image: "image in here"},
    {name:"Yaron", age: 8, projectName: "spelletje", image: "image in here"},
    {name:"Mariska", age: 6, projectName: "spelende hondjes", image: "image in here"}
];

/* -- End --> Temporary data for pages <-- End -- */

function addProject(new_project){
    var variableArray=["name","age", "project", "image"];
    for (i=0; i<variableArray.length; i++)
    if(new_project[variableArray[i]]===""){
        new_project[variableArray[i]] = "--------";
    }
    projectlist.push(new_project);
}

function addProjectdb(){
    
}

app.get("/",function(req, res){
    res.render("landing.ejs");
});

app.get("/addform",function(req, res){
    res.render("addform.ejs");
});

app.get("/projectspage", function(req, res){
    // var mijn object = maak link naar database. (read)
    var databaseObject;
    ScrProject.find(function (err, scrProjects) {
        if (err) return console.error(err);
        console.log("Dit is de database");
        databaseObject = scrProjects;
        res.render("projectspage.ejs", {projectlist: databaseObject});
      });
    //res.render("projectspage.ejs", {projectlist: projectlist}); // projectlist moet een referentie naar database worden. En mijn projectblock partial moet ook aangepast worden.
});

app.post("/add_project", function(req, res){
    console.log(req.body);
    addProject(req.body);
    res.redirect("/projectspage");
});

app.post("/add_projectb", function(req, res){
    console.log(req.body);
    var scrProjectNew = new ScrProject({
        name: req.body["name"],
        age: req.body["age"],
        scrProjectName: req.body["prName"],
        scrCards: req.body["prCards"],
        scrImage: req.body["prImage"],
        scrProjectDes: req.body["prDesc"],
        scrProjectTheme: req.body["prTheme"]
    });
    scrProjectNew.save (function(err, scrProject){
        if (err){
            console.log("booohhhh");
            res.redirect("/projectspage");
        }
        else{
            console.log("we hebben iets toegevoegd?");
            //console.log(scrProject);
            ScrProject.find(function (err, scrProjects) {
                if (err) return console.error(err);
                console.log("Dit is de database");
                console.log(scrProjects);
              });
              res.redirect("/projectspage");
        }
    });

});


app.listen(3000, function(){
    console.log("scratch server is listening");
});