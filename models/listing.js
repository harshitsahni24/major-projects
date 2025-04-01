const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

const ListingSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

ListingSchema.post("findOneAndDelete", async function (doc) {
    if (doc && doc.reviews && doc.reviews.length) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;