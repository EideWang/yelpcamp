var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var helper = require("../public/helper");
var middleware = require("../middleware"); //會自動require資料夾內的index.js

//用router.METHOD取代原本的app.METHOD

//show campground list page
router.get("/",(req,res)=>{
	Campground.find({},function(err, camps){
		if(err){
			console.log(err);
		}else{
			res.render("campground/campground.ejs", {campgrounds:camps,helper:helper,pageName:"campground"})
		}
	})
})

//show createCampground page
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	res.render("campground/createCampground",{pageName:"createCampground"});
})

//POST create a campground
router.post("/", middleware.isLoggedIn, (req,res)=>{
	var name = req.body.name;
	var description = req.body.description;
	var imgUrl = req.body.imgUrl;
	var author = {
		id: req.user._id,
		username:req.user.username
	}
	var newCampground = {name:name, image:imgUrl, description:description, author:author};
	Campground.create(newCampground, (err, newlyCreated)=>{
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	})
})

//show campground Info page
router.get("/:id",(req,res)=>{
	//populate().exec() 的用法，可以將原先campground內使用reference的comments"填入"其內容
	//若沒有populate的話，直接印出campground資訊，在camments的部分只會顯示[commentID]
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
		if(err){
			res.redirect("/campgrounds");
			console.log(err);
		}else{
			//console.log(foundCampground);
			res.render("campground/campgroundInfo",{campground:foundCampground, pageName:"campgroundInfo"});
		}
	})
})

//edit campground page
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		//這裡不用再handle err，因為checkCampgroundOwnership內已處理
		res.render("campground/editCampground",{campground:foundCampground, pageName:"editCampground"});
	});
});
//update campground route
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	//show updated campground Info page
})


//Destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,async(req, res) => {
  try {    
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.remove();
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    res.redirect("/campgrounds");
  }});



//自訂func.移至middleware index.js內
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkCampgroundOwnership(req,res,next){
// 	// have logined?
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id,(err,foundCampground)=>{
// 		if(err){
// 			console.log(err);
// 			res.redirect("/campgrounds");
// 		}else{
// 			//current user own this campground?
// 			//注意foundCampground.author.id回傳的是mongoose Object
// 			//而req.user._id回傳的是String
// 			//需使用.equals()或是toString()轉型
// 			if(foundCampground.author.id.equals(req.user._id)){
// 				next();   //注意!!!
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