const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Эндпоинт для получения данных о базовом плане тренировок
router.get('/basic-training-program', async (req, res) => {
    const { user_id, training_id } = req.query;

    if (!user_id || !training_id) {
        return res.status(400).json({ message: 'user_id и training_id обязательны' });
    }

    try {
        // Проверяем, есть ли у пользователя этот тренировочный план
        const [userTraining] = await db.query(
            `SELECT * FROM USER_TRAINING_TABLE WHERE user_id = ? AND training_id = ?`,
            [user_id, training_id]
        );

        if (!userTraining.length) {
            return res.status(404).json({ message: 'План тренировок для данного пользователя не найден' });
        }

        // Получаем данные тренировок (WORKOUTS_TABLE)
        const [workouts] = await db.query(
            `SELECT w.* FROM WORKOUTS_TABLE w WHERE w.training_plan_id = ?`,
            [training_id]
        );

        // Для каждого тренировки извлекаем упражнения (EXERCISES_TABLE)
        const workoutDetails = await Promise.all(
            workouts.map(async (workout) => {
                const [exercises] = await db.query(
                    `SELECT e.*, er.reps, er.sets FROM EXERCISES_TABLE e
                     JOIN EXERCISE_REP_TABLE er ON e.id = er.exercise_id
                     WHERE er.workout_id = ?`,
                    [workout.id]
                );

                return {
                    ...workout,
                    exercises,
                };
            })
        );

        res.status(200).json({ workouts: workoutDetails });
    } catch (error) {
        console.error('Ошибка при получении данных базового плана тренировок:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;