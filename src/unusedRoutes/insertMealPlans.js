const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/insert-mealplans', async (req, res) => {
    try {
        // Insert data into MEALPLANS_TABLE
        await db.query(`
            INSERT INTO MEALPLANS_TABLE (title, description)
            VALUES 
            ('1300 ккал', '7 вариантов рациона'),
            ('1400 ккал', '7 вариантов рациона'),
            ('1500 ккал', '7 вариантов рациона'),
            ('1600 ккал', '7 вариантов рациона'),
            ('1700 ккал', '7 вариантов рациона'),
            ('1800 ккал', '7 вариантов рациона'),
            ('1900 ккал', '7 вариантов рациона'),
            ('2000 ккал', '7 вариантов рациона'),
            ('2100-2200 ккал', '7 вариантов рациона'),
            ('2300-2400 ккал', '7 вариантов рациона'),
            ('2450 ккал', '7 вариантов рациона'),
            ('2500 ккал', '7 вариантов рациона'),
            ('2600-3000 ккал', '7 вариантов рациона');
        `);

        res.status(200).json({ message: 'Meal plans inserted successfully!' });
    } catch (error) {
        console.error("Error inserting meal plans:", error);
        res.status(500).json({ message: "Failed to insert meal plans", error: error.message });
    }
});

module.exports = router;