const Review = require("../models/reviews"); // Corrected path
const Listing = require("../models/listing");

module.exports.create = async (req, res) => {
    console.log(req.params.id); // Corrected from req.param.id
    let listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!req.body.review) {
        req.flash("error", "Invalid review data");
        return res.redirect(`/listings/${listing._id}`);
    }

    let newReview = new Review({
        comment: req.body.review.comment,  // Ensure correct field names
        rating: req.body.review.rating
    });

    newReview.author = req.user._id; // Associate review with user
    await newReview.save(); // Save the new review

    listing.reviews.push(newReview); // Correctly associate review with listing
    await listing.save(); // Save the listing with updated reviews
    req.flash("success", "New review created!");

    console.log("Review Added:", newReview); // Debugging log

    res.redirect(`/listings/${listing._id}`);
};

module.exports.delete = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted!");
    res.redirect(`/listings/${id}`);
};

module.exports.populateReviews = async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    console.log("Listing with reviews:", listing); // Debugging log
    res.render("listings/show.ejs", { listing });
};