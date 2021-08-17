var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

// MIDDLEWARE
var middlewareObj = {};

// middlewareObj.isUser = function (req, re, next) {
// 	passport.authenticate("local", {
// 	successRedirect: "/campgrounds",
// 	failureRedirect: "/login"
// })
// }

middlewareObj.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that.");
	res.redirect("/login");
};

middlewareObj.checkAuthForCampground = function (req, res, next) {
	if (!req.isAuthenticated()) {
		req.flash("error", "You need to be logged in to do that.");
		return res.redirect("/login");
	}
	Campground.findById(req.params.id, (err, foundCampground)=>{
		if (err || !foundCampground) {
			req.flash("error", "Campground not found.");
			res.redirect("back");
		} else {
			if (foundCampground.author.id.equals(req.user._id)) {
				return next();
			} else {
				req.flash("error", "You do not have the permission to do that.");
				res.redirect("/campgrounds/" + req.params.id);
			}
		}
	});
};

middlewareObj.checkAuthForComment = function (req, res, next) {
	if (!req.isAuthenticated()) {
		req.flash("error", "You need to be logged in to do that.");
		return res.redirect("/login");
	}
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if (err || !foundComment) {
			req.flash("error", "Comment not found.");
			res.redirect("back");
		} else {
			if (foundComment.author.id.equals(req.user._id)) {
				return next();
			} else {
				req.flash("error", "You do not have the permission to do that.");
				res.redirect("/campgrounds/" + req.params.id);
			}
		}
	});
};

module.exports = middlewareObj;