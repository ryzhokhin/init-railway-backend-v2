// routes/auth.js
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
const db = require('../db/connection');

async function getDatabaseUserId(telegramId) {
    try {
        const [rows] = await db.execute(
            'SELECT id, first_name, last_name, username FROM USERS_TABLE WHERE telegram_ID = ? LIMIT 1',
            [telegramId]
        );
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Database query error:', error);
        return null;
    }
}


function validateAndUnpackInitData(initDataStr) {
    const params = new URLSearchParams(initDataStr);
    const rawData = {};
    const parsedData = {};

    for (const [key, value] of params.entries()) {
        rawData[key] = value;
        parsedData[key] = key === 'user' ? JSON.parse(value) : value;
    }

    const receivedHash = rawData.hash;
    if (!receivedHash) throw new Error('Missing hash in initData');

    const dataCheckObj = { ...rawData };
    delete dataCheckObj.hash;
    const sortedKeys = Object.keys(dataCheckObj).sort();
    const dataCheckString = sortedKeys.map(key => `${key}=${dataCheckObj[key]}`).join('\n');

    const secretKey = crypto.createHmac('sha256', "WebAppData").update(BOT_TOKEN).digest();
    const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(receivedHash, 'hex')))
        throw new Error('Invalid initData hash');

    return parsedData;
}

router.post('/login', async (req, res) => {
    const { initData } = req.body;
    if (!initData) return res.status(400).json({ error: 'initData is required' });

    let unpackedData;
    try {
        unpackedData = validateAndUnpackInitData(initData);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }

    const telegramUser = unpackedData.user;
    if (!telegramUser || !telegramUser.id) {
        return res.status(400).json({ error: 'User data is missing in initData' });
    }

    const databaseUserId = await getDatabaseUserId(telegramUser.id);
    if (!databaseUserId) {
        return res.status(404).json({ error: 'User not found in database' });
    }

    const token = jwt.sign({ userId: databaseUserId }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({
        message: 'Login successful',
        token,
        user:telegramUser,
    });
});

module.exports = router;
