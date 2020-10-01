var mongoose = require("mongoose");
const Comment = require('./comment');

var campgroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
        	ref: "Comment"
		}],
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		}
		, username:String
	}
})
//在campground schema內加入middleware，新增"remove"function給campground model，
//會執行移除連帶的Comment Collection內的comment
campgroundSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});
var Campground = mongoose.model("Campground",campgroundSchema);

module.exports = Campground;