const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log('MongoDB is connected');
    })
    .catch(err => {
        console.error(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL)
};

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();

// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// const main = async () => {
//     try {
//         await mongoose.connect(MONGO_URL);
//         console.log("MongoDB is connected");
//     } catch (err) {
//         console.error("Error connecting to MongoDB:", err);
//     }
// };

// const initDB = async () => {
//     try {
//         await Listing.deleteMany({});
//         await Listing.insertMany(initData.data);
//         console.log("Data was initialized");
//     } catch (err) {
//         console.error("Error during database initialization:", err);
//     } finally {
//         await mongoose.disconnect();
//         console.log("MongoDB connection closed.");
//     }
// };

// main()
//     .then(() => initDB())
//     .catch(err => console.error("Unexpected error:", err));
