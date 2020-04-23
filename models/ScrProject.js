/* --------- Scratch Project Model --------- */

var   mongoose = require("mongoose"),
      Comment = require('./Comments.js');
 
var scrProjectSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   name: String,
   age: Number,
   scrProjectName: String,
   scrCards: String,
   scrImage: String,
   scrProjectDes: String,
   scrProjectTheme: String,
   comments: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "Comment"
   }]
});

scrProjectSchema.pre('deleteOne' ,function(next) {
   var temp = this.getQuery();
   var tempArray=[];
   for(i=0; i<temp.comments.length; i++){
      tempArray.push(temp.comments[i]._id);
   }
   
   Comment.deleteMany({_id: {$in: tempArray}}, function(err, commentCount){
      if (err){
         console.log(err);
         tempArray =0;
         tempArray = [];
         next();
      }
      else{
         console.log("deleted comments");
         console.log(commentCount);
         tempArray =0;
         tempArray = [];
         next();
      }
   });
});

module.exports = mongoose.model("ScrProject", scrProjectSchema);