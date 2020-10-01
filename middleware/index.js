//all middleware here
var Campground = require("../models/campground"),
	Comment    = require("../models/comment");
var middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("loginError", "You have to login first!")
	res.redirect("/login");
}


middlewareObj.checkCampgroundOwnership = function(req,res,next){
	// have logined?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,(err,foundCampground)=>{
		if(err){
			console.log(err);
			req.flash("campgroundError","Cannot find the specific campground.");
			res.redirect("/campgrounds");
		}else{
			//current user own this campground?
			//注意foundCampground.author.id回傳的是mongoose Object
			//而req.user._id回傳的是String
			//需使用.equals()或是toString()轉型
			if(foundCampground.author.id.equals(req.user._id)){
				next();   //注意!!!
			}else{
				req.flash("authenticationError","You don't have authentication to edit.");
				res.redirect("back");
			}	
		}
	})
	}else{
		req.flash("loginError", "You have to login first!");
		res.redirect("/login");
	}
}

middlewareObj.checkCommentOwnership=function(req,res,next){
	// have logined?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err){
			console.log(err);
			req.flash("commentError","Cannot find the specific comment.");
			res.redirect("back");
		}else{
			//current user own this comment?
			if(foundComment.author.id.equals(req.user._id)){
				next();   //導向接下來的其他函數
			}else{
				req.flash("authenticationError","You don't have authentication to edit.");
				res.redirect("back");
			}	
		}
	})
	}else{
		req.flash("loginError", "You have to login first!");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;