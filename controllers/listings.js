const Listing = require("../models/listing");

console.log(typeof Listing); // Check if Listing is a function or object

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs", { allListings });
};

module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
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
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.create = async (req, res, next) => {
    try {
        // Log req.file to check if it is defined and has the expected properties
        console.log(req.file);

        if (!req.file) {
            req.flash("error", "No file uploaded!");
            return res.redirect("/listings/new");
        }

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.images = [{ url, filename }]; // Ensure images is an array
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
};