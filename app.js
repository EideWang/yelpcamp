var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./models/seeds"),
	User = require("./models/user"),
	helper = require("./public/helper")

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
//設定靜態檔案資料來源
app.use(express.static(__dirname + '/public')); //Serves resources
app.use(methodOverride("_method"));

//使用connect-flash
app.use(flash());

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yelpcamp', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});


//seedDB();   //seed DB 餵入初始假資料


//mongoose的model，變數開頭習慣大寫，Model內第一個參數習慣跟var名稱一樣
//mongoose會自動將你的model名稱改為尋找"小寫且複數"的mongoDB內的collection
//如下的Campground會自動尋找DB內的"campgrounds"
//--移到models/campground.js內--
// var Campground = mongoose.model("Campground",campgroundSchema);


//=================
//  登入認證
//=================
app.use(require("express-session")({   //省略var expressSession宣告，並直接執行該func.
	secret:"Eide full-end practice",
	resave: false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

//passport-local-mongoose的設定
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//===================================================
//   ROUTE
//===================================================
//從外部routes資料夾匯入route設定
var indexRoutes = require("./routes/index"),
	campgroundRoutes = require("./routes/campground"),
	commentRoutes = require("./routes/comment");

//在每個route全加入currentUser這個變數(不用手動慢慢加)
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.login_error_messages = req.flash("loginError");
	res.locals.login_success_messages = req.flash("loginSuccess");
	res.locals.signup_success_messages = req.flash("signupSuccess");
	res.locals.signup_error_messages = req.flash("signupError");
	res.locals.logout_success_messages = req.flash("logoutSuccess");
	res.locals.campground_error_messages = req.flash("campgroundError");
	res.locals.comment_error_messages = req.flash("commentError");
	res.locals.authentication_error_messages = req.flash("authenticationError");
	next();
})
//add each path pattern(也可以不要這樣簡化)
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


//Port3000 connect
var port = process.env.PORT || 3000;
app.listen(port,function(){
	console.log("Server Started!")
});