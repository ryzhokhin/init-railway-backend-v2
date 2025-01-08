const express = require('express');
const router = express.Router();
const db = require('../db/connection')

router.get('/test-db', async (req, res) => {
    try {
        console.log("Testing database connection...");
        const [rows] = await db.query('SELECT 1');
        res.status(200).json({ message: "Database is connected!", data: rows });
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ message: "Database connection failed!" });
    }
});

module.exports = router;