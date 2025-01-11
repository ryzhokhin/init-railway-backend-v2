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

module.exports = router;