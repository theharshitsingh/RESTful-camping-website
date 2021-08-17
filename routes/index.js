var express = require("express"),
	router = express.Router(),
	User = require("../models/user.js"),
	passport = require("passport");

router.get("/", (req, res)=>{
	res.render("landing");
});

// REGISTER ROUTES
router.get("/register", (req, res)=>{
	res.render("register");
});

router.post("/register", (req, res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if (err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp, " + newUser.username);
			res.redirect("/campgrounds");
		});
	});
});

// LOGIN ROUTES
router.get("/login", (req, res)=>{
	res.render("login");
});


router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: true
}), (req, res)=>{
	req.flash("success", "You are successfully logged in");
});

router.get("/logout", (req, res)=>{
	req.logout();
	req.flash("success", "You are successfully logged out.");
	res.redirect("/campgrounds");
});

module.exports = router;