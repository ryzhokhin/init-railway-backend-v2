const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/insert-sample', async (req, res) => {
    try {
        await db.query(`
            INSERT INTO MEALPLANS_DAYS_TABLE (meal_plan_id, day_number, total_kcal, total_protein, total_fat, total_carbs)
            VALUES
            (1, 1, 1266, 99, 46, 116),
            (1, 2, 1291, 96, 58, 92),
            (1, 3, 1321, 100, 69, 65),
            (1, 4, 1289, 87, 46, 124),
            (1, 5, 1320, 105, 53, 100),
            (1, 6, 1237, 83, 53, 101),
            (1, 7, 1307, 124, 40, 111);
        `);

        res.status(200).json({ message: 'Sample meal plan days inserted successfully!' });
    } catch (error) {
        console.error('Error inserting sample meal plan days:', error);
        res.status(500).json({ message: 'Failed to insert sample meal plan days', error: error.message });
    }
});

module.exports = router;