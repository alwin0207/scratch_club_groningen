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

commentSchema.pre('remove',{document: true}, async function() {
	await User.updateOne({
		_id: {
			$in: this.user
    }
  },
  {
    $pull: {comments: this._id}
  });
});
 
module.exports = mongoose.model("Comment", commentSchema);
 