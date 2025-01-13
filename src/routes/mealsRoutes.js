const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Подключение к вашей базе данных

// Маршрут для удаления таблицы MEALS_TABLE
router.delete('/delete-meals-table', async (req, res) => {
    try {
        // SQL-запрос для удаления таблицы
        const query = `DROP TABLE IF EXISTS MEALS_TABLE`;
        await db.query(query); // Выполнение запроса
        res.status(200).json({ message: 'MEALS_TABLE успешно удалена.' });
    } catch (error) {
        console.error('Ошибка при удалении таблицы:', error);
        res.status(500).json({ error: 'Ошибка сервера при удалении таблицы.' });
    }
});

module.exports = router;