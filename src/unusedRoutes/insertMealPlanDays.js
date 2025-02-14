const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/insert-sample', async (req, res) => {
    try {
        await db.query(`
            INSERT INTO MEALPLANS_DAYS_TABLE (meal_plan_id, day_number, total_kcal, total_protein, total_fat, total_carbs)
            VALUES
            (2, 1, 1338, 131, 31, 127),
            (2, 2, 1332, 96, 46, 130),
            (2, 3, 1353, 119, 49, 111),
            (2, 4, 1302, 94, 49, 121),
            (2, 5, 1400, 125, 58, 90),
            (2, 6, 1402, 110, 45, 136),
            (2, 7, 1401, 100, 56, 113);
        `);

        res.status(200).json({ message: 'Sample meal plan days inserted successfully!' });
    } catch (error) {
        console.error('Error inserting sample meal plan days:', error);
        res.status(500).json({ message: 'Failed to insert sample meal plan days', error: error.message });
    }
});

module.exports = router;