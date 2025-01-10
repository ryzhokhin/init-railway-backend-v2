const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Не обязателен, если Railway подставит переменные

const app = express();
// app.use(cors());
app.use(bodyParser.json());

app.use(cors({
    origin: 'https://zhiroazhigatel.netlify.app/', // Укажите URL вашего фронтенда
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Разрешите отправку cookies/credentials
    allowedHeaders: ['Content-Type']
}));
app.options('*', cors());

// testing without headers

// Проверка подключения к базе данных
app.use((req, res, next) => {
    console.log("Request Headers:", req.headers);
    res.setHeader('Access-Control-Allow-Origin', 'https://zhiroazhigatel.netlify.app/'); // Ваш фронтенд-домен
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Обязательно для cookies/credentials
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE'); // Поддерживаемые методы
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Обязательно, если передаются данные
    next();
});


// routes connections
const testRoutes = require('./routes/test');
const setupRoutes = require('./routes/setup');
const userRoutes = require('./routes/users');


// routes application
app.use('/test', testRoutes);
app.use('/setup', setupRoutes);
app.use('/users', userRoutes);


app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    console.log("Requested");
    next();
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, '::', () => {
    console.log(`Server listening on [::]${PORT}`);
});