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

  var myArray=this.getQuery()._id["$in"];
	User.updateMany({
    comments: {$in: myArray}
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

commentSchema.pre('deleteOne', function(next) {
  var myQuery = this.getQuery();
  console.log(myQuery);
  console.log("hallo, delete one wordt aangeroepen")
  User.updateOne({_id: this.getQuery().user._id}, {$pull: {comments: this.getQuery()._id}}, function(err, updatedfilesa){
    if(err){
      console.log(err);
      return next();
    }
    else{
      console.log(updatedfilesa);
      console.log(myQuery);
     next();
    }
  }); 
});

module.exports = mongoose.model("Comment", commentSchema);
 