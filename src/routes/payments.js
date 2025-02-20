const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authenticator = require('../management/authMiddleware');
const axios = require("axios");

const bot = require("../bot/bot"); // ✅ Import your existing bot instance

const BOT_TOKEN = process.env.BOT_TOKEN;

/**
 * Route to generate a test payment invoice link using Telegram Stars.
 *
 * This endpoint interacts with the Telegram API to create a payment link,
 * allowing users to make payments via Telegram Stars within the Mini App.
 *
 * @route POST /payment/test-payment
 * @access Protected
 * @param {string} title - Title of the invoice.
 * @param {string} description - Description of the purchase.
 * @param {string} payload - Unique identifier for the payment transaction.
 * @param {string} currency - Payment currency (must be 'XTR' for Telegram Stars).
 * @param {Array} prices - Array containing pricing details.
 * @returns {Object} - JSON response with `invoiceLink` on success or error details.
 *
 * @throws {400} - If Telegram API request fails.
 * @throws {500} - If an internal server error occurs.
 */
router.post("/test-payment", authenticator.authenticateJWT, async (req, res) => {
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