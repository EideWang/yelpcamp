const mongoose = require("mongoose");
//導入passport-local-mongoose
const passportLocalMongoose = require("passport-local-mongoose");



var UserSchema = new mongoose.Schema({
	username:String,
	password:String
});
//添加passport-local-mongoose在User Schema內
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);