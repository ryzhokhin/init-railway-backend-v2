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

// 📌 Handles Test Payment Request
bot.onText(/\/testpayment/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const response = await axios.post(`${BACKEND_PUBLIC_URL}/payments/test-payment`, {
            title: "Test Course Purchase",
            description: "Testing Telegram Stars payment",
            payload: `test_payment_transaction_${chatId}`,
            currency: "XTR",
            prices: [{ label: "Test Purchase", amount: 1 }], // 1 Star (100 units)
        });

        if (response.data.success) {
            const invoiceLink = response.data.invoiceLink;
            await bot.sendMessage(
                chatId,
                `✅ Нажмите на кнопку ниже, чтобы оплатить:`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "💰 Оплатить",
                                    url: invoiceLink,
                                },
                            ],
                        ],
                    },
                }
            );
        } else {
            await bot.sendMessage(chatId, `❌ Ошибка: ${response.data.error}`);
        }
    } catch (error) {
        console.error("❌ Error generating invoice:", error);
        await bot.sendMessage(chatId, "❌ Ошибка при создании платежа. Попробуйте позже.");
    }
});

// 📌 Handles Successful Payment Confirmation
bot.on("successful_payment", async (msg) => {
    const chatId = msg.chat.id;
    const paymentInfo = msg.successful_payment;

    try {
        // ✅ Extract payload data
        const payload = JSON.parse(paymentInfo.invoice_payload);
        const telegramId = payload.telegram_id;
        const userId = payload.user_id; // User ID from backend
        const trainingId = payload.training_id;

        console.log(`📦 Payment Confirmed: Telegram ID: ${telegramId}, User ID: ${userId}, Training ID: ${trainingId}`);

        // ✅ Add Training to User in DB
        const addTrainingResponse = await axios.post(
            `${BACKEND_PUBLIC_URL}/trainings/add-training`,
            {
                user_id: userId,
                training_id: trainingId,
            }
        );

        console.log("✅ Training Added:", addTrainingResponse.data);
        await bot.sendMessage(
            chatId,
            `✅ Оплата прошла успешно! 🎉 Теперь тренировка доступна в вашем профиле.`
        );
    } catch (error) {
        console.error("❌ Payment Processing Error:", error);
        await bot.sendMessage(chatId, "⚠ Ошибка при обработке платежа. Свяжитесь с поддержкой.");
    }
});

console.log("🚀 Bot is running...");

module.exports = bot;