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


router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        // Join the `USER_MEALS_TABLE` with the `MEALPLANS_TABLE` to fetch the user's meal plans
        const [rows] = await db.query(
            `SELECT mp.* 
             FROM USER_MEALS_TABLE um
             JOIN MEALPLANS_TABLE mp ON um.meal_plan_id = mp.id
             WHERE um.user_id = ?`,
            [userId]
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching user meal plans:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;