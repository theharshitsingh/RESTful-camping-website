// IMPORTS
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	seedDB = require("./seed.js"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	methodOverride = require("method-override"),
	User = require("./models/user.js"),
	Comment = require("./models/comment.js"),
	flash = require("connect-flash"),
	Campground = require("./models/campground.js");

var campgroundsRoutes = require("./routes/campground.js"),
	commentRoutes = require("./routes/comment.js"),
	indexRoutes = require("./routes/index.js");

// SETTING DATABASE
mongoose.connect("mongodb://localhost:27017/yelp_app",{useNewUrlParser: true, useUnifiedTopology: true});

// APP CONFIG
app.use(flash());
app.use(require("express-session")({
	secret: "Rusty is the cutest dog in the world",
	resave: false,
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.set('useFindAndModify', false);
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
app.use(methodOverride("_method"));
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);


// PASSPORT CONFIG
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
            


// SEEDING THE DATA
//seedDB();

// SERVER
app.listen(3000, ()=>{
	console.log("The Yelp app has started");
});