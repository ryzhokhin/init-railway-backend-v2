const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/add-meals', async (req, res) => {
    const mealsData = [
        {
            meal_plan_day_id: 1,
            type: 'завтрак',
            composition: 'Рис (или любая другая крупа) –\n' +
                '50 гр. (в сухом виде); Клубника\n' +
                '(любые виды ягод свежих или\n' +
                'замороженных) – 50 гр.; Кофе\n' +
                'или чай без сахара или сахзам\n' +
                'Яйцо – 1 шт.',
            preparation: 'Отварить рис (или любую\n' +
                'другую крупу). В готовую\n' +
                'кашу добавить\n' +
                'клубнику, по желанию\n' +
                'добавить подсластитель. К\n' +
                'каше добавляем 1 отварное\n' +
                'яйц0. Данное количество\n' +
                'ингредиентов рассчитано на\n' +
                '1 раз (или на 1 человека).\n' +
                'Если хотите приготовить\n' +
                'завтрак сразу на 2 дня,\n' +
                'просто увеличьте\n' +
                'ингредиенты вдвое',
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
            composition: 'Грудка индейки с рисом и\n' +
                'овощной нарезкой. филе\n' +
                'грудки индейки (в сыром виде) -\n' +
                '150гр. Рис белый (в сухом виде) -\n' +
                ' 50гр. Огурец -1 шт, помидор - 1\n' +
                'шт',
            preparation: 'грудку индейки жарим без\n' +
                'масла на антипригарной\n' +
                'сковородке (моэжно на\n' +
                'гриле стейком) , либо\n' +
                'запекаем. Рис варим, овощи\n' +
                'нарезаем',
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
            composition: 'Рыба с овощами. Кета свежая -\n' +
                '200гр, Брокколи -100гр,\n' +
                'морковь -1шт, Борлгарский\n' +
                'перец -100гр, Лимон, Любая\n' +
                'зелень, соль специи по вкусу',
            preparation: 'Филе рыбе порезать и\n' +
                'натереть солью и специями,\n' +
                'взбрызнуть лимонным\n' +
                'соком, оставить на 15 мин,\n' +
                'Овощи порезать. Рыбу и\n' +
                'овощи положить в пакет для\n' +
                'запекания, выпкеать 30 мин\n' +
                '180гр, укарсить готовое\n' +
                'блюдо зеленью',
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