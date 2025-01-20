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

router.get('/:mealPlanDayId', async (req, res) => {
    const { mealPlanDayId } = req.params;

    try {
        // SQL-запрос для выборки данных из MEALS_TABLE
        const [rows] = await db.query(
            `
            SELECT 
                id, 
                meal_plan_day_id, 
                type, 
                composition, 
                preparation, 
                image_src, 
                kcal, 
                protein, 
                fat, 
                carbs 
            FROM MEALS_TABLE
            WHERE meal_plan_day_id = ?
            `,
            [mealPlanDayId]
        );

        // Проверяем, есть ли данные
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No meals found for this day.' });
        }

        // Возвращаем данные
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ message: 'Failed to fetch meals', error: error.message });
    }
});
module.exports = router;