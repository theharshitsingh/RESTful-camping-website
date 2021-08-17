// Imports
var express = require("express"),
	router = express.Router({mergeParams: true}),
	Campground = require("../models/campground.js"),
	Comment = require("../models/comment.js"),
	middlewareObj = require("../middleware");

// New Comment form
router.get("/new", middlewareObj.isLoggedIn, (req, res)=> {
	Campground.findById(req.params.id, (err, campground)=>{
		if (err || !campground) {
			req.flash("error", "Campground not found.");
			res.redirect("back");
		} else {
			res.render("./comment/new", {campground: campground});
		}
	});
	
});

// Create Comment
router.post("/", middlewareObj.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if (err || !campground) {
			req.flash("error", "Campground not found.");
			res.redirect("back");
		} else {
			Comment.create(req.body.comment, (err, comment)=>{
				if (err) {
					req.flash("error", "Comment not found.");
					res.redirect("back");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment added successfully.")
					res.redirect("/campgrounds/"+ campground._id);
				}
			});
		}
	});
});

// Edit Comment
router.get("/:comment_id/edit", middlewareObj.checkAuthForComment,  (req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if (err || !foundComment) {
			req.flash("error", "Comment not found.");
			res.redirect("back");
		} else {
			res.render("./comment/edit", {comment: foundComment, campground_id: req.params.id});
		}
	});
});

// Update Comment
router.put("/:comment_id", middlewareObj.checkAuthForComment, (req, res)=>{
	Comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, (err, updatedComment)=>{
		if (err || !updatedComment) {
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			req.flash("success", "Comment updated successfully.")
			res.redirect("/campgrounds/"+req.params.id);	
		}
	});
});

// Delete Comment
router.delete("/:comment_id", middlewareObj.checkAuthForComment, (req, res)=>{
	Comment.findOneAndDelete({_id: req.params.comment_id}, (err, deletedComment)=>{
		if (err || !deletedComment) {
			req.flash("error", "Comment not found.");
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted successfully.")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;