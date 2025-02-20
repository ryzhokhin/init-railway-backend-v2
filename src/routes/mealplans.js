const express = require('express');
const router = express.Router();
const db = require('../db/connection');

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
router.get('/get-mealplan', async (req, res) => {
    try {
        const { calories } = req.query;

        if (!calories) {
            return res.status(400).json({ message: 'Calories value is required' });
        }

        const [mealPlan] = await db.query(
            'SELECT * FROM MEALPLANS_TABLE WHERE title <= ? ORDER BY title DESC LIMIT 1',
            [calories]
        );

        if (mealPlan.length === 0) {
            return res.status(404).json({ message: 'No meal plan found for the given calories.' });
        }

        res.status(200).json(mealPlan[0]);
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        res.status(500).json({ message: 'Error fetching meal plan', error: error.message });
    }
});

module.exports = router;