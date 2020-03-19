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
      }
   ]
});

scrProjectSchema.pre('deleteOne' ,function(next) {
   console.log("ik wordt aangeroepen");
   console.log(this.getQuery().comments[0]);
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
         console.log("we found comments");
         console.log(commentCount);
         tempArray =0;
         tempArray = [];
         next();
      }
   });

	/*Comment.deleteMany({
		_id: {
			$in: temp
		}
   }, function(err, yeah){
      if(err){console.log(err);
      next();
      }
      else{
         console.log(yeah);
         console.log("Ik ga via de else naar update");
         next();
      }
   }); */
});

module.exports = mongoose.model("ScrProject", scrProjectSchema);