const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Replace with your actual database connection file

// Endpoint to fetch all data from MEALS_TABLE
router.get('/all', async (req, res) => {
    try {
        const [meals] = await db.query('SELECT * FROM MEALS_TABLE');
        res.status(200).json(meals);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ message: 'Error fetching meals', error: error.message });
    }
});

module.exports = router;