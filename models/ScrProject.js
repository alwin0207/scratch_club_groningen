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

scrProjectSchema.pre('remove',{query: true}, async function() {
   console.log("ik wordt aangeroepen");
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});

module.exports = mongoose.model("ScrProject", scrProjectSchema);