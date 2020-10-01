var express = require("express");
var router = express.Router({mergeParams:true});
var passport = require("passport");
var User = require("../models/user");

router.get("/",(req,res)=>{
	res.render("home",{pageName:"home"});
})


//show register form
router.get("/register",(req,res)=>{
	//res.render("./views/authentication/register");
	res.render("authentication/register",{pageName:"register"});  //express會找views folder內的view

})
//handle sign up logic
router.post("/register",(req,res)=>{
	var newUser = new User({username:req.body.username});
	User.register(newUser, req.body.password, function(err, newlyUser){
		if(err){
			console.log(err);
			req.flash("signupError", err.message);
			return res.redirect("/register");  //不用if else要加return結束func
		}
		passport.authenticate('local')(req, res, function(){
			req.flash("signupSuccess","Welcome to join Yelpcamp!!!");
			res.redirect("/campgrounds");
		});
			})
})

//show login form
router.get("/login",(req,res)=>{
	res.render("authentication/login",{pageName:"login"});
})
//handle login logic
//函式為app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",{
	//successRedirect: '/campgrounds',   
	failureRedirect: '/login',
	failureFlash: true
}),(req,res)=>{
	//進到這個callback func.表示已經success
	req.flash("loginSuccess","Success Login! Welcome!!");
	res.redirect("/");
})

//handle logout page
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("logoutSuccess","Have logged out.")
	res.redirect("/");
})

module.exports = router;