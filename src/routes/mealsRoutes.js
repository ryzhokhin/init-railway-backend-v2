const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authenticator = require("../management/authMiddleware"); // Replace with your actual database connection file

// Endpoint to fetch all data from MEALS_TABLE
router.get('/all', authenticator.authenticateJWT, async (req, res) => {
    try {
        const [meals] = await db.query('SELECT * FROM MEALS_TABLE');
        res.status(200).json(meals);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ message: 'Error fetching meals', error: error.message });
    }
});

/**
 * Endpoint to fetch an appropriate meal plan based on calorie intake.
 *
 * The user provides their calorie target via a query parameter, and the system
 * retrieves the closest matching meal plan available in the database.
 *
 * @route GET /mealplans/get-mealplan
 * @query {number} calories - The target calorie intake for selecting a meal plan.
 * @returns {Object} - The meal plan that best matches the calorie requirement.
 *
 * @throws {400} - If no calorie value is provided.
 * @throws {404} - If no matching meal plan is found.
 * @throws {500} - If a database or server error occurs.
 */
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