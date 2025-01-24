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

module.exports = router;