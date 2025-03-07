const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, wrapAsync(listingController.createListing));

// new route
router.get("/new", isLoggedIn, listingController.newForm);

router.route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn, isOwner, wrapAsync(listingController.update))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));


module.exports = router;