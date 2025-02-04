// routes/auth.js

const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// Your Telegram Bot Token – set this in your environment variables or replace with your actual token.
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';

/**
 * Unpacks and validates the Telegram initData.
 *
 * Telegram sends the initData as a query string. The steps are:
 *  1. Parse the query string into an object.
 *  2. Extract and remove the "hash" parameter.
 *  3. Build the data-check string by sorting the remaining keys alphabetically
 *     and joining them in the format "key=value" separated by "\n".
 *  4. Compute the secret key as:
 *         secret_key = HMAC_SHA256(botToken, "WebAppData")
 *  5. Compute the HMAC-SHA256 of the data-check string using the secret key.
 *  6. Compare the computed hash with the received hash using timingSafeEqual.
 *
 * @param {string} initDataStr - The initData as a query string.
 * @returns {Object} - The parsed initData object if valid.
 * @throws {Error} - If the initData is invalid.
 */
function validateAndUnpackInitData(initDataStr) {
    // Parse the query string into an object.
    const params = new URLSearchParams(initDataStr);
    const initData = {};
    for (const [key, value] of params.entries()) {
        // For keys like "user" that may be JSON, attempt to parse.
        if (key === 'user') {
            try {
                initData[key] = JSON.parse(value);
            } catch (err) {
                initData[key] = value;
            }
        } else {
            initData[key] = value;
        }
    }

    // Ensure the "hash" parameter exists.
    const receivedHash = initData.hash;
    if (!receivedHash) {
        throw new Error('Missing hash in initData');
    }
    // Remove the hash from the object for calculation.
    const dataCheckObj = { ...initData };
    delete dataCheckObj.hash;

    // Create the data-check string by sorting keys alphabetically.
    const sortedKeys = Object.keys(dataCheckObj).sort();
    const dataCheckString = sortedKeys
        .map(key => `${key}=${dataCheckObj[key]}`)
        .join('\n');

    // Compute the secret key using HMAC-SHA256 with "WebAppData" as the key.
    const secretKey = crypto.createHmac('sha256', "WebAppData")
        .update(BOT_TOKEN)
        .digest();

    // Compute the HMAC-SHA256 hash of the data-check string using the secret key.
    const computedHash = crypto.createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // Validate the computed hash against the received hash.
    const valid = crypto.timingSafeEqual(
        Buffer.from(computedHash, 'hex'),
        Buffer.from(receivedHash, 'hex')
    );

    if (!valid) {
        throw new Error('Invalid initData hash');
    }
    return initData;
}

/**
 * POST /auth/login
 *
 * Expects a JSON body with an "initData" field containing the Telegram initData (query string).
 * If valid, the user's data is stored in the session.
 */
router.post('/login', (req, res) => {
    const { initData } = req.body;
    if (!initData) {
        return res.status(400).json({ error: 'initData is required in the request body' });
    }

    let unpackedData;
    try {
        // Validate and unpack the initData.
        unpackedData = validateAndUnpackInitData(initData);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }

    // Extract Telegram user data (expects initData.user exists and contains an "id").
    const telegramUser = unpackedData.user;
    if (!telegramUser || !telegramUser.id) {
        return res.status(400).json({ error: 'User data is missing in initData' });
    }

    // Create the user session by storing the user data.
    req.session.user = telegramUser;
    // Optionally, store the entire unpacked initData if needed.
    req.session.initData = unpackedData;

    // Return a response with the session ID and user info.
    return res.json({
        message: 'Login successful',
        sessionID: req.session.id,
        user: telegramUser
    });
});

module.exports = router;