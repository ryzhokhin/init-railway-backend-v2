const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authenticator = require('../management/authMiddleware');
const axios = require("axios");

const bot = require("../bot/bot"); // ✅ Import your existing bot instance

const BOT_TOKEN = process.env.BOT_TOKEN;

router.post("/test-payment", async (req, res) => {
    try {
        const { title, description, payload, currency, prices } = req.body;

        // ✅ Request Telegram API to generate an invoice link
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            title,
            description,
            payload,
            currency,
            prices
        });

        if (response.data.ok) {
            const invoiceLink = response.data.result;
            res.json({ success: true, invoiceLink });
        } else {
            res.status(400).json({ success: false, error: response.data.description });
        }
    } catch (error) {
        console.error("❌ Error creating invoice link:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;