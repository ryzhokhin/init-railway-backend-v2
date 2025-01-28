const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Эндпоинт для получения всех тренировочных планов
router.get('/training-plans', async (req, res) => {
    try {
        const [trainingPlans] = await db.query('SELECT * FROM TRAINING_PLANS_TABLE');
        res.status(200).json(trainingPlans);
    } catch (error) {
        console.error('Ошибка получения данных тренировочных планов:', error);
        res.status(500).json({ message: 'Не удалось загрузить тренировочные планы' });
    }
});

router.post('/add-training', async (req, res) => {
    try {
        const { user_id, training_id } = req.body;

        // Проверка, что данные переданы
        if (!user_id || !training_id) {
            return res.status(400).json({ message: 'Не переданы user_id или training_id' });
        }

        // Добавление записи в таблицу USER_TRAINING_TABLE
        await db.query(
            'INSERT INTO USER_TRAINING_TABLE (user_id, training_id, added_date) VALUES (?, ?, NOW())',
            [user_id, training_id]
        );

        res.status(200).json({ message: 'Тренировка успешно добавлена' });
    } catch (error) {
        console.error('Ошибка добавления тренировки:', error);
        res.status(500).json({ message: 'Ошибка добавления тренировки' });
    }
});


router.get('/get_user_training/:userId', async (req, res) => {
    try {
        // Join the USER_TRAINING_TABLE with the TRAINING_PLANS_TABLE to fetch the user's training plans
        const [rows] = await db.query(
            `
      SELECT tp.*
      FROM USER_TRAINING_TABLE ut
      JOIN TRAINING_PLANS_TABLE tp ON ut.training_id = tp.id
      WHERE ut.user_id = ?;
      `,
            [userId]
        );

        res.status(200).json(rows); // Return the retrieved rows
    } catch (err) {
        console.error("Error fetching user training plans:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get(
    "/get_user_workouts/:trainingPlanId/:userId",
    async (req, res) => {
        const { trainingPlanId, userId } = req.params;

        try {
            // Step 1: Check if the user has access to the training plan
            const [userTrainingRow] = await db.query(
                `
        SELECT *
        FROM USER_TRAINING_TABLE
        WHERE user_id = ? AND training_id = ?
        `,
                [userId, trainingPlanId]
            );

            if (!userTrainingRow || userTrainingRow.length === 0) {
                return res.status(404).json({ error: "Training plan not found for this user" });
            }

            // Step 2: Fetch workouts for the training plan
            const [workouts] = await db.query(
                `
        SELECT *
        FROM WORKOUTS_TABLE
        WHERE training_plan_id = ?
        ORDER BY order_num
        `,
                [trainingPlanId]
            );

            if (!workouts || workouts.length === 0) {
                return res.status(404).json({ error: "No workouts found for this training plan" });
            }

            // Step 3: Return the workouts
            res.status(200).json(workouts);
        } catch (error) {
            console.error("Error fetching workouts:", error);
            res.status(500).json({ error: "Server error" });
        }
    }
);


module.exports = router;