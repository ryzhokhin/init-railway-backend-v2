const db = require('../db/connection');
const cron = require('node-cron');
const bot = require("../bot/bot"); // ✅ Import your existing bot instance


/**
 * Scheduled job to delete expired meal plans and training plans every day at midnight.
 *
 * This job runs once per day and removes any records where the expiration date has passed.
 */
cron.schedule('0 0 * * *', async () => {
    try {
        // Delete expired meal plans
        const [deletedMeals] = await db.query(
            `DELETE FROM USER_MEALS_TABLE WHERE expiration_date < NOW()`
        );
        console.log(`🗑 Deleted ${deletedMeals.affectedRows} expired meal plans.`);

        // Delete expired training plans
        const [deletedTrainings] = await db.query(
            `DELETE FROM USER_TRAINING_TABLE WHERE expiration_date < NOW()`
        );
        console.log(`🗑 Deleted ${deletedTrainings.affectedRows} expired training plans.`);

    } catch (error) {
        console.error("❌ Error deleting expired plans:", error);
    }
});

async function sendExpirationReminders() {
    try {
        console.log("📢 Running daily expiration reminder task...");

        // ✅ Fetch users with training plans expiring in 3 days
        const [expiringTrainingUsers] = await db.query(`
            SELECT ut.user_id, ut.training_id, u.telegram_ID 
            FROM USER_TRAINING_TABLE ut
            JOIN USERS_TABLE u ON ut.user_id = u.id
            WHERE ut.expiration_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 MONTH)
        `);

        // ✅ Fetch users with meal plans expiring in 3 days
        const [expiringMealUsers] = await db.query(`
            SELECT um.user_id, um.meal_plan_id, u.telegram_ID 
            FROM USER_MEALS_TABLE um
            JOIN USERS_TABLE u ON um.user_id = u.id
            WHERE um.expiration_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 MONTH)
        `);

        // 🔹 Send reminders for expiring training plans
        for (const user of expiringTrainingUsers) {
            await bot.sendMessage(
                user.telegram_ID,
                `🔥 Привет, чемпион! 
                
📅 Через *3 дня* истекает доступ к твоему *тренировочному плану* 🏋️‍♂️  
Ты ведь не собираешься останавливать свой прогресс? 😏

Продли подписку сейчас, чтобы не потерять доступ к своим тренировкам! 💪  
👉 Будет кнопка ниже на продление 👈`
            );
        }

        // 🔹 Send reminders for expiring meal plans
        for (const user of expiringMealUsers) {
            await bot.sendMessage(
                user.telegram_ID,
                `🍏 Привет, гурман! 

📅 Через *3 дня* истекает доступ к твоему *плану питания* 🍽️  
Ты ведь не хочешь сбиться с курса и потерять свой результат? 😮

Продли подписку сейчас, чтобы продолжать следовать своему рациону! ✅  
👉 Будет кнопка ниже на продление 👈`
            );
        }

        console.log("✅ Expiration reminders sent successfully.");
    } catch (error) {
        console.error("❌ Error sending expiration reminders:", error);
    }
}



// Schedule the task to run every day at 12 PM
cron.schedule("0 12 * * *", sendExpirationReminders);

// 🛠 Тестовый запуск вручную


console.log("🔄 Scheduled cleanup for expired plans is running daily at midnight.");

module.exports = {};