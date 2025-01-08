const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config(); // Не обязателен, если Railway подставит переменные

const app = express();
// app.use(cors());
app.use(bodyParser.json());



// Настройка CORS с указанием разрешённого фронтенд-домена
// app.use(cors({
//     origin: "http://localhost:3001", // Укажите URL вашего фронтенда
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true // Разрешите отправку cookies/credentials
// }));
app.use(cors({
    origin: 'https://zhiroazhigatel.netlify.app/', // Укажите URL вашего фронтенда
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Разрешите отправку cookies/credentials
}));
// Проверка подключения к базе данных
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'https://zhiroazhigatel.netlify.app'); // Ваш фронтенд-домен
//     res.setHeader('Access-Control-Allow-Credentials', 'true'); // Обязательно для cookies/credentials
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE'); // Поддерживаемые методы
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Обязательно, если передаются данные
//     next();
// });

app.get('/test-db', async (req, res) => {
    try {
        const connection = await mysql.createConnection(process.env.MYSQL_URL);
        console.log("Database connected!");
        await connection.end();
        res.status(200).json({ message: "Database is connected!" });
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ message: "Database connection failed!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});