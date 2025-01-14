const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/add-meals', async (req, res) => {
    const mealsData = [
        {
            meal_plan_day_id: 1,
            type: 'завтрак',
            composition: 'Рис (или любая другая крупа) – 50 гр...',
            preparation: 'Отварить рис...',
            image_src: 'https://link_to_image.jpg',
            kcal: 258,
            protein: 10,
            fat: 8,
            carbs: 44,
        },
        {
            meal_plan_day_id: 1,
            type: 'перекус',
            composition: 'мандарины – 2 шт',
            preparation: null,
            image_src: 'https://link_to_image.jpg',
            kcal: 36,
            protein: 0,
            fat: 0,
            carbs: 8,
        },
        {
            meal_plan_day_id: 1,
            type: 'обед',
            composition: 'Грудка индейки с рисом...',
            preparation: 'Грудку индейки жарим...',
            image_src: 'https://link_to_image.jpg',
            kcal: 341,
            protein: 39,
            fat: 3,
            carbs: 40,
        },
        {
            meal_plan_day_id: 1,
            type: 'перекус',
            composition: 'Грецкие или миндаль...',
            preparation: null,
            image_src: 'https://link_to_image.jpg',
            kcal: 281,
            protein: 6,
            fat: 27,
            carbs: 4,
        },
        {
            meal_plan_day_id: 1,
            type: 'ужин',
            composition: 'Рыба с овощами...',
            preparation: 'Филе рыбы порезать...',
            image_src: 'https://link_to_image.jpg',
            kcal: 350,
            protein: 44,
            fat: 8,
            carbs: 20,
        },
    ];

    try {
        const query = `INSERT INTO MEALS_TABLE (meal_plan_day_id, type, composition, preparation, image_src, kcal, protein, fat, carbs)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        for (const meal of mealsData) {
            await db.query(query, [
                meal.meal_plan_day_id,
                meal.type,
                meal.composition,
                meal.preparation,
                meal.image_src,
                meal.kcal,
                meal.protein,
                meal.fat,
                meal.carbs,
            ]);
        }

        res.status(201).json({ message: 'Meals successfully added to the table' });
    } catch (error) {
        console.error('Error adding meals:', error);
        res.status(500).json({ error: 'Server error while adding meals' });
    }
});

module.exports = router;