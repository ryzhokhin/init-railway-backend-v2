const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config(); // Не обязателен, если Railway подставит переменные

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Проверка подключения к базе данных
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