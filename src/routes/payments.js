const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const authenticator = require('../management/authMiddleware');

router.post("/test-payment", authenticator.authenticateJWT, async (req, res) => {
    try {
        const { amount, description } = req.body;
        const userId = authenticator.getUserIdFromToken(req);

        console.log(`🔹 Processing test payment: ${amount} Stars for ${userId}`);

        // Simulate a successful payment response
        const paymentResponse = {
            success: true,
            message: "Test payment of 1 Telegram Star completed successfully",
            userId,
            amount,
        };

        console.log("✅ Payment Successful:", paymentResponse);
        res.json(paymentResponse);
    } catch (error) {
        console.error("❌ Test payment processing error:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;