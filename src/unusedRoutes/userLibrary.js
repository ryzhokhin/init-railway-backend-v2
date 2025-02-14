const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// // Добавление записи в USER_GUIDE_TABLE
// router.post('/add', async (req, res) => {
//     const { user_id, guide_id } = req.body;
//
//     if (!user_id || !guide_id) {
//         return res.status(400).json({ message: 'user_id and guide_id are required' });
//     }
//
//     try {
//         const query = 'INSERT INTO USER_GUIDE_TABLE (user_id, guide_id, added_date) VALUES (?, ?, NOW())';
//         await db.query(query, [user_id, guide_id]);
//
//         res.status(201).json({ message: 'Guide added to library successfully' });
//     } catch (error) {
//         console.error('Error adding guide to library:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

module.exports = router;