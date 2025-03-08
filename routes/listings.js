const express = require('express');
const router = express.Router();
const Listing = require('../models/listing'); // Assuming you have a Listing model

// POST /listings route handler
router.post('/listings', async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const newListing = new Listing({ title, description, price });
        await newListing.save();
        res.status(201).json(newListing);
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;