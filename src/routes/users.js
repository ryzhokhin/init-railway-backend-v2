const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Подключение к базе данных

router.post('/login', async (req, res) => {
    const { telegram_id, first_name } = req.body;

    if (!telegram_id || !first_name) {
        return res.status(400).json({ message: "Telegram ID and first name are required." });
    }

    try {
        // Проверяем, существует ли пользователь в базе по telegram_id
        const [existingUser] = await db.query('SELECT * FROM users WHERE telegram_ID = ?', [telegram_id]);

        if (existingUser.length === 0) {
            // Если пользователя нет, добавляем его
            const [result] = await db.query(
                'INSERT INTO users (telegram_ID, first_name, date_registered, date_last_login) VALUES (?, ?, NOW(), NOW())',
                [telegram_id, first_name]
            );

            return res.status(201).json({
                id: result.insertId, // ID нового пользователя в базе
                telegram_id,
                first_name,
                registration_date: new Date().toISOString(),
                last_login: new Date().toISOString(),
            });
        } else {
            // Если пользователь существует, обновляем поле date_last_login
            await db.query('UPDATE users SET date_last_login = NOW() WHERE telegram_ID = ?', [telegram_id]);

            return res.status(200).json({
                id: existingUser[0].id,
                telegram_id: existingUser[0].telegram_ID,
                first_name: existingUser[0].first_name,
                registration_date: existingUser[0].date_registered,
                last_login: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;