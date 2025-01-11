const express = require('express');
const router = express.Router();
const db = require('../db/connection')

//something fixed in this file
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

module.exports = router;




