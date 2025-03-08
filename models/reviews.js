const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true // Ensure comment is required
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true // Ensure rating is required
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true // Ensure author is required
    }
});

module.exports = mongoose.model("Review", reviewSchema);
