const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authenticator = require("../management/authMiddleware");

/**
 * Route to save a meal plan for an authenticated user.
 *
 * @route POST /mealplans/save-mealplan
 * @access Protected
 * @param {string} mealPlanId - The ID of the meal plan to save.
 * @returns {string} - Confirmation message.
 * @throws {400} - If userId or mealPlanId is missing.
 * @throws {409} - If the user already has a meal plan saved.
 * @throws {500} - If a database error occurs.
 */
router.post('/save-mealplan', authenticator.authenticateJWT, async (req, res) => {
    try {
        // const { userId, mealPlanId } = req.body;
        const userId = authenticator.getUserIdFromToken(req);
        const mealPlanId = req.body.mealPlanId;

        if (!userId || !mealPlanId) {
            return res.status(400).json({ message: 'userId и mealPlanId обязательны.' });
        }

        // Проверка, существует ли уже план для этого пользователя
        const [existingPlans] = await db.query(
            'SELECT * FROM USER_MEALS_TABLE WHERE user_id = ?',
            [userId]
        );

        if (existingPlans.length > 0) {
            return res.status(409).json({ message: 'Пользователь уже имеет план питания.' });
        }

        // Если планов нет, добавляем новый
        await db.query(
            'INSERT INTO USER_MEALS_TABLE (user_id, meal_plan_id, added_date, expiration_date) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 2 MONTH))',
            [userId, mealPlanId]
        );

        res.status(200).json({ message: 'План питания успешно сохранен.' });
    } catch (error) {
        console.error('Ошибка сохранения плана питания:', error);
        res.status(500).json({ message: 'Ошибка сохранения плана питания.', error: error.message });
    }
});

/**
 * Route to fetch all meal plans associated with the authenticated user.
 *
 * @route GET /mealplans/mealLibrary
 * @access Protected (Requires JWT Token)
 * @returns {Object[]} - List of user's saved meal plans.
 * @throws {500} - If a database error occurs.
 */
router.get("/mealLibrary", authenticator.authenticateJWT, async (req, res) => {
    // ℹ️ "/:userId", ℹ️ old version
    const userId = authenticator.getUserIdFromToken(req);

    try {
        // Join the `USER_MEALS_TABLE` with the `MEALPLANS_TABLE` to fetch the user's meal plans
        const [rows] = await db.query(
            `SELECT mp.* 
             FROM USER_MEALS_TABLE um
             JOIN MEALPLANS_TABLE mp ON um.meal_plan_id = mp.id
             WHERE um.user_id = ? AND um.expiration_date > NOW()`,
            [userId]
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching user meal plans:", err);
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * Route to fetch meal plan days associated with a specific meal plan.
 *
 * @route GET /mealplans/days/:mealPlanId
 * @param {string} mealPlanId - The ID of the meal plan.
 * @returns {Object[]} - List of meal plan days.
 * @throws {404} - If no meal plan days are found.
 * @throws {500} - If a database error occurs.
 */
router.get("/days/:mealPlanId", async (req, res) => {
    const { mealPlanId } = req.params;

    try {
        // Query to select meal plan days based on meal_plan_id
        const [rows] = await db.query(
            `SELECT * 
             FROM MEALPLANS_DAYS_TABLE 
             WHERE meal_plan_id = ?`,
            [mealPlanId]
        );

        // Check if any rows were returned
        if (rows.length === 0) {
            return res.status(404).json({ message: "No meal plan days found for the given meal_plan_id" });
        }

        res.status(200).json(rows); // Return the fetched meal plan days
    } catch (err) {
        console.error("Error fetching meal plan days:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;