const express = require('express');
const router = express.Router();
const db = require('../db/connection');
router.get('/setup-tables', async (req, res) => {
    try {
        // USERS_TABLE
        // await db.query(`
        //     CREATE TABLE IF NOT EXISTS USERS_TABLE (
        //         id INT AUTO_INCREMENT PRIMARY KEY,
        //         telegram_ID INT NOT NULL UNIQUE,
        //         first_name VARCHAR(255),
        //         date_registered DATETIME,
        //         date_last_login DATETIME
        //     );
        // `);

        // GUIDES_TABLE
        // await db.query(`
        //     CREATE TABLE IF NOT EXISTS GUIDES_TABLE (
        //         id INT AUTO_INCREMENT PRIMARY KEY,
        //         guide_key VARCHAR(50) NOT NULL UNIQUE,
        //         frontend_title VARCHAR(255),
        //         num_page INT,
        //         card_chip VARCHAR(50),
        //         image_src TEXT
        //     );
        // `);

        // MEALPLANS_TABLE
        // await db.query(`
        //     CREATE TABLE IF NOT EXISTS MEALPLANS_TABLE (
        //         id INT AUTO_INCREMENT PRIMARY KEY,
        //         title VARCHAR(255),
        //         description TEXT
        //     );
        // `);

        // MEALPLANS_DAYS_TABLE
        // await db.query(`
        //     CREATE TABLE IF NOT EXISTS MEALPLANS_DAYS_TABLE (
        //         id INT AUTO_INCREMENT PRIMARY KEY,
        //         meal_plan_id INT NOT NULL,
        //         day_number INT NOT NULL,
        //         total_kcal INT,
        //         total_protein INT,
        //         total_fat INT,
        //         total_carbs INT,
        //         FOREIGN KEY (meal_plan_id) REFERENCES MEALPLANS_TABLE(id)
        //     );
        // `);

        // MEALS_TABLE
        await db.query(`
            CREATE TABLE IF NOT EXISTS MEALS_TABLE (
                id INT AUTO_INCREMENT PRIMARY KEY,
                meal_plan_day_id INT NOT NULL,
                type ENUM('breakfast', 'lunch', 'dinner', 'snack'),
                composition TEXT,
                preparation TEXT,
                image_src TEXT,
                kcal INT,
                protein INT,
                fat INT,
                carbs INT,
                FOREIGN KEY (meal_plan_day_id) REFERENCES MEALPLANS_DAYS_TABLE(id)
            );
        `);

        // USER_GUIDE_TABLE
        // await db.query(`
        //     CREATE TABLE IF NOT EXISTS USER_GUIDE_TABLE (
        //         id INT AUTO_INCREMENT PRIMARY KEY,
        //         user_id INT NOT NULL,
        //         guide_id INT NOT NULL,
        //         added_date DATETIME,
        //         FOREIGN KEY (user_id) REFERENCES USERS_TABLE(id),
        //         FOREIGN KEY (guide_id) REFERENCES GUIDES_TABLE(id)
        //     );
        // `);

        // USER_MEALS_TABLE
        // await db.query(`
        //     CREATE TABLE IF NOT EXISTS USER_MEALS_TABLE (
        //         id INT AUTO_INCREMENT PRIMARY KEY,
        //         user_id INT NOT NULL,
        //         meal_plan_id INT NOT NULL,
        //         added_date DATETIME,
        //         FOREIGN KEY (user_id) REFERENCES USERS_TABLE(id),
        //         FOREIGN KEY (meal_plan_id) REFERENCES MEALPLANS_TABLE(id)
        //     );
        // `);

        res.status(200).json({ message: "All tables created successfully!" });
    } catch (error) {
        console.error("Error creating tables:", error);
        res.status(500).json({ message: "Failed to create tables", error: error.message });
    }
});

module.exports = router;