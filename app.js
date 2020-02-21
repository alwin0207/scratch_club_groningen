var express = require("express");
var app = express();

app.use(express.static('stylesheets'));

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

app.get("/",function(req, res){
    res.render("landing.ejs");
});

app.get("/projectspage", function(req, res){
    res.render("projectspage.ejs", {projectlist: projectlist});
});




app.listen(3000, function(){
    console.log("scratch server is listening");
});