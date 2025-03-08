const Listing = require("../models/listing");

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
        console.log(listing);
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to fetch the listing.");
        res.redirect("/listings");
    }
};

module.exports.create = async (req, res, next) => {
    try {
        console.log(req.file);

        if (!req.file) {
            req.flash("error", "No file uploaded!");
            return res.redirect("/listings/new");
        }

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.images = [{ url, filename }];
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to create listing.");
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
        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to fetch the listing.");
        res.redirect("/listings");
    }
};

module.exports.update = async (req, res) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to update listing.");
        res.redirect(`/listings/${id}`);
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