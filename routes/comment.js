var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground"),
	Comment    = require("../models/comment");
var middleware = require("../middleware")
//add isLoggedIn 作為middleware，確保先登入才能留言
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	Campground.findById(req.params.id,(err, foundCampground)=>{
		if(err){
			console.log(err);
		}else{
			//console.log(foundCampground._id);
			res.render("comment/createComment",{campground:foundCampground, pageName:"createComment"})
		}
	});
});
//add isLoggedIn 作為middleware，確保先登入才能留言
router.post("/",middleware.isLoggedIn,(req,res)=>{
	//console.log("id is: "+req.params.id);
	Campground.findById(req.params.id,(err, foundCampground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds/"+req.params.id);
		}else{
			//console.log(foundCampground);
			Comment.create(req.body.comment, (err, newlyComment)=>{
				if(err){
					console.log(err);
				}else{
					//console.log(newlyComment);
					//add username and id to comment
					newlyComment.author.id = req.user._id;
					newlyComment.author.username = req.user.username;
					newlyComment.save(); //push前記得save()
					foundCampground.comments.push(newlyComment);
					foundCampground.save();
					// console.log("new comment is: "+newlyComment);
					// console.log("try to show username......"+newlyComment.author.id.username);
					res.redirect("/campgrounds/"+foundCampground._id);
				}
			})
		}
	});
	
});

//edit comment route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
	var campground_id = req.params.id; //不用去存取整個campground collection，因為只用到campground id
	//而campground id在route內可以query到
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.render("comment/editComment",{campground_id:campground_id, comment:foundComment, pageName:"editComment"});
		}
	})
})

//update editted comment
router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment)=>{
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//destroy comment route
router.delete("/:comment_id",middleware.checkCommentOwnership, (req,res)=>{
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

//自訂func.移至middleware index.js內
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCommentOwnership(req,res,next){
// 	// have logined?
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id,(err,foundComment)=>{
// 		if(err){
// 			console.log(err);
// 			res.redirect("back");
// 		}else{
// 			//current user own this comment?
// 			if(foundComment.author.id.equals(req.user._id)){
// 				next();   //導向接下來的其他函數
// 			}else{
// 				res.redirect("back");
// 			}	
// 		}
// 	})
// 	}else{
// 		console.log("have to login and then edit");
// 		res.redirect("/login");
// 	}
// }


module.exports = router;