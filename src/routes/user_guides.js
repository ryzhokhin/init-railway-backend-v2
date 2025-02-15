const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authenticator = require("../management/authMiddleware");

router.get("/load", authenticator.authenticateJWT, async (req, res) => {

    const userId = authenticator.getUserIdFromToken(req);

    console.log("🔹 Extracted User ID:", userId); // Debugging Log

    if (!userId) {
        console.error("❌ Error: User ID is undefined!");
        return res.status(401).json({ error: "Unauthorized: Invalid user token" });
    }


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
router.post('/add', authenticator.authenticateJWT ,async (req, res) => {
    // const { user_id, guide_id } = req.body;
    const user_id = authenticator.getUserIdFromToken(req);
    const guide_id = req.guide_id;

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

// Delete a guide from USER_GUIDE_TABLE
router.delete('/delete', authenticator.authenticateJWT ,async (req, res) => {
    const user_id = authenticator.getUserIdFromToken(req);
    const guide_id = req.guide_id;

    if (!user_id || !guide_id) {
        return res.status(400).json({ message: 'user_id and guide_id are required' });
    }

    try {
        const query = 'DELETE FROM USER_GUIDE_TABLE WHERE user_id = ? AND guide_id = ?';
        await db.query(query, [user_id, guide_id]);

        res.status(200).json({ message: 'Guide removed from library successfully' });
    } catch (error) {
        console.error('Error removing guide from library:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;