const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust',
        format: async (req, file) => 'jpeg', // Fixed the issue by changing 'allowed_formats' to 'format'
        allowed_formats: ['jpeg', 'png', 'jpg'], // This line can be removed if not needed
    },
});

module.exports = { cloudinary, storage };