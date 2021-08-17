function seedDB() {
	var Campground = require("./models/campground.js"),
		Comment = require("./models/comment.js");
	
	
	
	Campground.deleteMany({}, (err)=>{
		console.log("campgrounds deleted");
		// data.forEach((campground)=>{
		// 	Campground.create(campground, (err, newCampground)=>{
		// 		if (err) {
		// 			console.log(err);
		// 		} else {
		// 			console.log("New campground created");
		// 			Comment.create({
		// 				text:"omg!!.. so beautiful",
		// 				author:"homer"
		// 			}, (err, comment)=>{
		// 				if (err) {
		// 					console.log(err);
		// 				} else {
		// 					newCampground.comments.push(comment);
		// 					newCampground.save();
		// 					console.log("comment created");
		// 				}
		// 			})
		// 		}
		// 	});
		// });
	});
		
}
module.exports = seedDB;

	