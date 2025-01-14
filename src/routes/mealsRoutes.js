const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Подключение к вашей базе данных

// Маршрут для удаления таблицы MEALS_TABLE
router.post('/create-meals-table', async (req, res) => {
    try {

        await db.query(`
            CREATE TABLE IF NOT EXISTS MEALS_TABLE (
                id INT AUTO_INCREMENT PRIMARY KEY,
                meal_plan_day_id INT NOT NULL,
                type ENUM('завтрак', 'обед', 'ужин', 'перекус'),
                composition TEXT,
                preparation TEXT,
                image_src TEXT,
                kcal INT,
                protein INT,
                fat INT,
                carbs INT,
                FOREIGN KEY (meal_plan_day_id) REFERENCES MEALPLANS_DAYS_TABLE(id)
            );
        `);

        res.status(200).json({ message: 'MEALS_TABLE успешно создана.' });
    } catch (error) {
        console.error('Ошибка при создании таблицы:', error); // Логирование ошибки
        res.status(500).json({ error: 'Ошибка сервера при создании таблицы.' });
    }
});

module.exports = router;