var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/scratchprojectsdb', {useNewUrlParser: true});

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

var scrProjectNew = new ScrProject({
    name: "Benny",
    age: 30,
    scrProjectName: "a database",
    scrCards: "basis",
    scrImage: "Dit is een image url",
    scrProjectDes: "Dit is de description van mijn eerste database",
    scrProjectTheme: "Hoe werkt het"
})

scrProjectNew.save (function(err, scrProject){
    if (err){
        console.log("booohhhh");
    }
    else{
        console.log("we hebben iets toegevoegd?");
        //console.log(scrProject);
        ScrProject.find(function (err, scrProjects) {
            if (err) return console.error(err);
            console.log("Dit is de database");
            console.log(scrProjects);
          });
    }
});

/* ScrProject.find(function (err, scrProjects) {
    if (err) return console.error(err);
    console.log("Dit is de database");
    console.log(scrProjects);
  });

  ScrProject.find({ age: 30 }, function (err, scrProjects) {
    if (err) return console.error(err);
    console.log("Dit is de database");
    console.log(scrProjects);
  });
  */