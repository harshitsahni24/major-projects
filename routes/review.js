const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');
const reviewController = require('../controllers/reviews.js');

// post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.create));

// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.delete));

// Populate reviews
router.get("/listings/:id", wrapAsync(reviewController.populateReviews));

module.exports = router;