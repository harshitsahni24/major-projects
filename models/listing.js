const { ref } = require("joi");
const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./reviews");

const ListingSchema = new Schema({
    title: String,
    description: String,
    image: {
        type: String,
        default: "https://pixabay.com/photos/tree-sunrise-field-prairie-meadow-7186835/",
        set: (v) => v === "" ? "https://pixabay.com/photos/tree-sunrise-field-prairie-meadow-7186835/" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

ListingSchema.post("findOneAndDelete", async function (listing) {
    if (listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;