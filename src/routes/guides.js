const express = require('express');
const router = express.Router();
const db = require('../db/connection')

router.get('/all', async (req, res) => {
   try{
       const [guides] = await db.query('SELECT * FROM GUIDES_TABLE');
       if(guides.length === 0){
           return res.status(404).json({error: 'No guides found'});
       }
       res.status(200).json(guides);
   } catch (error) {
       console.error("Error fetching guids:", error);
       res.status(  500).json({error: 'Server error'});
   }
});

// Проверить, добавлен ли гайд в библиотеку пользователя
router.get('/check/:user_id/:guide_id', async (req, res) => {
    const { user_id, guide_id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT * FROM USER_GUIDE_TABLE WHERE user_id = ? AND guide_id = ?`,
            [user_id, guide_id]
        );
        res.status(200).json({ exists: rows.length > 0 });
    } catch (error) {
        console.error('Error checking guide status:', error);
        res.status(500).json({ message: 'Failed to check guide status' });
    }
});

// Добавить гайд в библиотеку пользователя
router.post('/add', async (req, res) => {
    const { user_id, guide_id } = req.body;

    if (!user_id || !guide_id) {
        return res.status(400).json({ error: "user_id and guide_id are required." });
    }

    try {
        const query = `
            INSERT INTO USER_GUIDE_TABLE (user_id, guide_id, added_date)
            VALUES (?, ?, NOW())
        `;
        await db.query(query, [user_id, guide_id]);
        res.status(200).json({ message: "Guide successfully added to user library!" });
    } catch (error) {
        console.error("Error adding guide to library:", error);
        res.status(500).json({ error: "Failed to add guide to library." });
    }
});

// Удалить гайд из библиотеки пользователя
router.delete('/remove/:user_id/:guide_id', async (req, res) => {
    const { user_id, guide_id } = req.params;

    try {
        await db.query(
            `DELETE FROM USER_GUIDE_TABLE WHERE user_id = ? AND guide_id = ?`,
            [user_id, guide_id]
        );
        res.status(200).json({ message: 'Guide removed from user library successfully!' });
    } catch (error) {
        console.error('Error removing guide from user library:', error);
        res.status(500).json({ message: 'Failed to remove guide from user library' });
    }
});

module.exports = router;




