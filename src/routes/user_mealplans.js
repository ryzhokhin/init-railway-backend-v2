const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/save-mealplan', async (req, res) => {
    try {
        const { userId, mealPlanId } = req.body;

        if (!userId || !mealPlanId) {
            return res.status(400).json({ message: 'userId и mealPlanId обязательны.' });
        }

        // Проверка, существует ли уже план для этого пользователя
        const [existingPlans] = await db.query(
            'SELECT * FROM USER_MEALS_TABLE WHERE user_id = ?',
            [userId]
        );

        if (existingPlans.length > 0) {
            return res.status(409).json({ message: 'Пользователь уже имеет план питания.' });
        }

        // Если планов нет, добавляем новый
        await db.query(
            'INSERT INTO USER_MEALS_TABLE (user_id, meal_plan_id, added_date) VALUES (?, ?, NOW())',
            [userId, mealPlanId]
        );

        res.status(200).json({ message: 'План питания успешно сохранен.' });
    } catch (error) {
        console.error('Ошибка сохранения плана питания:', error);
        res.status(500).json({ message: 'Ошибка сохранения плана питания.', error: error.message });
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