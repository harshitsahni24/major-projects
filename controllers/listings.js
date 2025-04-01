const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

console.log(typeof Listing); // Check if Listing is a function or object

module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        console.log(allListings);
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to fetch listings.");
        res.redirect("/listings");
    }
};

module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                },
            })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }

        // Provide default coordinates if missing or invalid
        if (!listing.geometry || !Array.isArray(listing.geometry.coordinates) || listing.geometry.coordinates.length !== 2) {
            listing.geometry = {
                type: "Point",
                coordinates: [77.5946, 12.9716] // Default to Bangalore, India [longitude, latitude]
            };
        }

        console.log("Listing geometry:", listing.geometry); // Debugging
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to fetch the listing.");
        res.redirect("/listings");
    }
};

module.exports.create = async (req, res) => { // Removed 'next' parameter
    try {
        // Validate location input
        if (!req.body.listing || !req.body.listing.location) {
            req.flash("error", "Location is required.");
            return res.redirect("/listings/new");
        }

        // Geocode the location
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1
            }).send();

        if (!response || !response.body.features || response.body.features.length === 0) {
            req.flash("error", "Invalid location. Please try again.");
            return res.redirect("/listings/new");
        }

        // Validate file upload
        if (!req.file) {
            req.flash("error", "No file uploaded!");
            return res.redirect("/listings/new");
        }

        // Extract file details
        const { path: url, filename } = req.file;

        // Create new listing
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;

        console.log(newListing.geometry.coordinates); // Log the coordinates to verify

        // Save listing to database
        await newListing.save();

        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", "Unable to create listing. Please try again.");
        res.redirect("/listings/new");
    }
};

module.exports.editForm = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }

        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("uploads", "uploads/w_300,");

        res.render("listings/edit.ejs", {
            listing, originalImageUrl
        });
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to fetch the listing.");
        return res.redirect("/listings");
    }
};

module.exports.update = async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
        req.flash("success", "Listing updated!");
        return res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to update listing.");
        return res.redirect(`/listings/${id}`);
    }
};

module.exports.delete = async (req, res) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to delete listing.");
        res.redirect("/listings");
    }
};