const TelegramBot = require('node-telegram-bot-api');
const token = '7761056672:AAEe8gPZjn3L47D-nrQvUOtAA3nPNnMVfzM';
const bot = new TelegramBot(token, {polling: true});
const webAppUrl = 'https://zhiroazhigatel.netlify.app/';


// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Добро пожаловать в Жиросжигатель! Мы рады видеть вас среди наших пользователей. Впереди вас ждут эффективные тренировки и проверенные методики, которые помогут вам достичь своих целей. Если у вас есть вопросы или нужна помощь, наша команда всегда готова поддержать вас. Удачи и успешных тренировок! 💪🔥', {

        })

        await bot.sendMessage(chatId, 'Перейти в никуда', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Войти', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }


    if(text === '/test') {
        await bot.sendMessage(chatId, 'test1', {

        })
    }
});




// ✅ Подтверждение оплаты
bot.on("pre_checkout_query", async (query) => {
    await bot.answerPreCheckoutQuery(query.id, true);
});

// 🎉 Обработка успешной оплаты
bot.on("successful_payment", async (msg) => {
    const chatId = msg.chat.id;
    const paymentInfo = msg.successful_payment;

    try {
        // if (!paymentInfo.invoice_payload) {
        //     throw new Error("🚨 Ошибка: invoice_payload отсутствует!");
        // }

        // ✅ Получаем user_id и telegram_id из payload
        const payload = JSON.parse(paymentInfo.invoice_payload);

        await bot.sendMessage(chatId, `✅ Поздравляем! Вы купили план тренировок 🎉 Теперь он доступен в вашем профиле.`);

    } catch (error) {
        console.error("❌ Ошибка при обработке покупки:", error);
        await bot.sendMessage(chatId, "⚠ Ошибка при обработке платежа. Свяжитесь с поддержкой.");
    }
});

console.log("🚀 Bot is running...");

module.exports = bot;