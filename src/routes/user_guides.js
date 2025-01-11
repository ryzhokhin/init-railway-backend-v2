const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        // Join the `USER_GUIDE_TABLE` with the `GUIDES_TABLE` to fetch the user's guides
        const [rows] = await db.query(
            `SELECT g.* 
             FROM USER_GUIDE_TABLE ug
             JOIN GUIDES_TABLE g ON ug.guide_id = g.id
             WHERE ug.user_id = ?`,
            [userId]
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching user guides:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Добавление записи в USER_GUIDE_TABLE
router.post('/add', async (req, res) => {
    const { user_id, guide_id } = req.body;

    if (!user_id || !guide_id) {
        return res.status(400).json({ message: 'user_id and guide_id are required' });
    }

    try {
        const query = 'INSERT INTO USER_GUIDE_TABLE (user_id, guide_id, added_date) VALUES (?, ?, NOW())';
        await db.query(query, [user_id, guide_id]);

        res.status(201).json({ message: 'Guide added to library successfully' });
    } catch (error) {
        console.error('Error adding guide to library:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;