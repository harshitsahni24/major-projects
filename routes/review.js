const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require('../schema.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};

// post delete route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log(req.params.id); // Corrected from req.param.id
    let listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let newReview = new Review({
        comment: req.body.review.comment,  // Ensure correct field names
        rating: req.body.review.rating
    });

    await newReview.save();

    listing.reviews.push(newReview); // Correctly associate review with listing
    await listing.save(); // Save the listing with updated reviews

    console.log("Review Added:", newReview); // Debugging log

    res.redirect(`/listings/${listing._id}`);
}));

// delete review route
router.delete("/:reviewId", wrapAsync(async (req, res) => { // Corrected from :reviewsId to :reviewId
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

// Populate reviews
router.get("/listings/:id", wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    console.log("Listing with reviews:", listing); // Debugging log
    res.render("listings/show.ejs", { listing });
}));

module.exports = router;