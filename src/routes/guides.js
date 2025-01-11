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

router.post('/add-to-library', async (req, res) => {
    const { user_id, guide_id } = req.body;

    if (!user_id || !guide_id) {
        return res.status(400).json({ error: 'user_id and guide_id are required.' });
    }

    try {
        // Проверяем, существует ли уже такая запись
        const [existingEntry] = await db.query(
            'SELECT * FROM USER_GUIDE_TABLE WHERE user_id = ? AND guide_id = ?',
            [user_id, guide_id]
        );

        if (existingEntry.length > 0) {
            return res.status(409).json({ message: 'This guide is already in the library.' });
        }

        // Добавляем запись в таблицу USER_GUIDE_TABLE
        await db.query(
            'INSERT INTO USER_GUIDE_TABLE (user_id, guide_id, added_date) VALUES (?, ?, NOW())',
            [user_id, guide_id]
        );

        res.status(201).json({ message: 'Guide added to library successfully.' });
    } catch (error) {
        console.error('Error adding guide to library:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;




