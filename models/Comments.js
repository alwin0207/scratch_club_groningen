/* --------- Comment Model --------- */

var mongoose = require("mongoose"),
    User = require("./User.js");
 
var commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
});



commentSchema.pre('deleteMany', function(next) {
  //console.log("en ik nu ook");
  //console.log(this)
  //console.log("en nu de querie");
console.log("vanaf hier");
 console.log(this.getQuery());
 console.log(this.getQuery()._id);
 console.log(this.getQuery()._id["$in"]);
 myArray=this.getQuery()._id["$in"];
 


	User.updateMany({
    comments: {$all: myArray}
  },
  {
    $pull: {comments: {$in: myArray}}
  }, function (err, removedcomments){
    if (err){
      console.log(err);
      next()
    }
    else{
      console.log("removed from user");
      console.log(removedcomments);
      next();
    }
  });  
});

module.exports = mongoose.model("Comment", commentSchema);
 