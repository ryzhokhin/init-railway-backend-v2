const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Endpoint для получения подходящего плана питания
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