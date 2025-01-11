const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/save-mealplan', async (req, res) => {
    try {
        const { userId, mealPlanId } = req.body;

        if (!userId || !mealPlanId) {
            return res.status(400).json({ message: 'userId and mealPlanId are required' });
        }

        await db.query(
            'INSERT INTO USER_MEALS_TABLE (user_id, meal_plan_id, added_date) VALUES (?, ?, NOW())',
            [userId, mealPlanId]
        );

        res.status(200).json({ message: 'Meal plan saved successfully' });
    } catch (error) {
        console.error('Error saving meal plan:', error);
        res.status(500).json({ message: 'Error saving meal plan', error: error.message });
    }
});


module.exports = router;