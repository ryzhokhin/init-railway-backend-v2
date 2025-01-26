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

router.get('/user-plans', async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
    }

    try {
        const query = `
            SELECT tp.*
            FROM USER_TRAINING_TABLE ut
            JOIN TRAINING_PLANS_TABLE tp ON ut.training_id = tp.id
            WHERE ut.user_id = ?;
        `;
        const [results] = await db.query(query, [user_id]);

        res.status(200).json(results);
    } catch (error) {
        console.error('Ошибка получения тренировочных планов пользователя:', error);
        res.status(500).json({ message: 'Не удалось загрузить тренировочные планы пользователя' });
    }
});

module.exports = router;