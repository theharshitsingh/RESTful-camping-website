var express = require("express"),
	router = express.Router(),
	Campground = require("../models/campground.js"),
	middlewareObj = require("../middleware");

// INDEX PAGE OF CAMPGROUNDS
router.get("/", (req, res)=> {
	Campground.find({}, (err, allcampgrounds)=>{
		if (err || !allcampgrounds){
			req.flash("error", "Campground not found.");
			res.redirect("/");
		}				 
		else{
			res.render("./campground/index", {campgrounds: allcampgrounds});
		}
	});
});

// ADD NEW CAMPGROUND FORM
router.get("/new", middlewareObj.isLoggedIn, (req, res)=>{
	res.render("./campground/new");
});

// ADD NEW CAMPGROUND
router.post("/", middlewareObj.isLoggedIn, (req, res)=>{
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
	Campground.create(newCampground, (err, campground)=>{
		if (err || !campground){
			req.flash("error", err.message);
		}
		else {
			req.flash("success", "New Campground Added");
			res.redirect("/campgrounds");
		}
	});
	
});

// SHOW A CAMPGROUND
router.get("/:id", (req, res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, foundcampground)=>{
		if (err || !foundcampground){
			req.flash("error", "Campground not found.");
			res.redirect("/campgrounds");
		}
		else{
			res.render("./campground/show", {campground: foundcampground});
		}
	});
});

// EDIT A CAMPGROUND
router.get("/:id/edit", middlewareObj.checkAuthForCampground, (req, res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		if (err || !foundCampground) {
			req.flash("error", "Campground not found.");
			res.redirect("back");
		}	else {
			res.render("./campground/edit", {campground: foundCampground});
		}
	});
	
});

// UPDATE A CAMPGROUND
router.put("/:id", middlewareObj.checkAuthForCampground, (req, res)=>{
	Campground.findOneAndUpdate({_id: req.params.id}, req.body.campground, (err, updatedCampground)=>{
		if (err || !updatedCampground) {
			req.flash("error", "Campground not found.");
			res.redirect("back");
		} else {
			req.flash("success", "Cammpground Updated");
			res.redirect("/campgrounds/" + updatedCampground._id);
		}
	})
});

// DESTROY A CAMPGROUND
router.delete("/:id", middlewareObj.checkAuthForCampground, (req, res)=>{
	Campground.findOneAndDelete({_id: req.params.id}, (err, deletedCampground)=>{
		if (err || !deletedCampground) {
			req.flash("error", "Campground not found.");
			res.redirect("back");
		} else {
			req.flash("success", "Campground deleted");
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;