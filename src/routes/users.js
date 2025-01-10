const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/login', async (req, res) => {
    // Логирование тела запроса для отладки
    console.log("Headers:", req.headers);
    console.log("Request Body:", req.body);

    const { telegram_id, first_name } = req.body;

    if (!telegram_id || !first_name) {
        return res.status(400).json({ message: 'telegram_id and first_name are required' });
    }

    try {
        const [existingUser] = await db.query(
            'SELECT * FROM USERS_TABLE WHERE telegram_id = ?',
            [telegram_id]
        );

        if (existingUser.length === 0) {
            // Если пользователь не найден, создаем новую запись
            await db.query(`
                INSERT INTO USERS_TABLE (telegram_id, first_name, date_registered, date_last_login)
                VALUES (?, ?, NOW(), NOW())
            `, [telegram_id, first_name]);

            return res.status(201).json({
                message: 'New user created',
                telegram_id,
                first_name,
                date_registered: new Date().toISOString(),
                date_last_login: new Date().toISOString(),
            });
        } else {
            // Если пользователь найден, обновляем дату последнего входа
            await db.query(`
                UPDATE USERS_TABLE SET date_last_login = NOW() WHERE telegram_id = ?
            `, [telegram_id]);

            return res.status(200).json({
                message: 'User login updated',
                telegram_id,
                first_name: existingUser[0].first_name,
                date_registered: existingUser[0].date_registered,
                date_last_login: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error handling user login' });
    }
});

module.exports = router;