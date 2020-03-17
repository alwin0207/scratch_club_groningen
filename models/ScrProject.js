/* --------- Scratch Project Model --------- */

var mongoose = require("mongoose");
 
var scrProjectSchema = new mongoose.Schema({
   user: String,
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
 
module.exports = mongoose.model("ScrProject", scrProjectSchema);