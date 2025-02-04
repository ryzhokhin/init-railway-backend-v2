// routes/auth.js

const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// Your Telegram Bot Token – set this in your environment variables or replace with your actual token.
const BOT_TOKEN = process.env.BOT_TOKEN;
console.log('BOT_TOKEN', BOT_TOKEN);

/**
 * Validates and unpacks Telegram initData based on the Telegram WebApp guidelines.
 *
 * Telegram documentation:
 *   data_check_string = sorted(key1=value1\nkey2=value2\n...)
 *   secret_key = HMAC_SHA256("WebAppData", bot_token)
 *   hash = HMAC_SHA256(data_check_string, secret_key) in hexadecimal
 *
 * @param {string} initDataStr - The initData string received from the Telegram WebApp (a query string).
 * @returns {Object} - The parsed initData object if valid.
 * @throws {Error} - Throws an error if the hash is missing or invalid.
 */
function validateAndUnpackInitData(initDataStr) {
    // Parse the query string into an object.
    const params = new URLSearchParams(initDataStr);
    const initData = {};
    for (const [key, value] of params.entries()) {
        // If the key is 'user', it might be a JSON-encoded object.
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

    // Make sure the 'hash' parameter exists.
    const receivedHash = initData.hash;
    if (!receivedHash) {
        throw new Error('Missing hash in initData');
    }

    // Remove the hash field from the data to form the data-check object.
    const dataCheckObj = { ...initData };
    delete dataCheckObj.hash;

    // Create the data-check string:
    // 1. Sort keys alphabetically.
    // 2. Join as "key=value" pairs with newline ('\n') as a separator.
    const sortedKeys = Object.keys(dataCheckObj).sort();
    const dataCheckString = sortedKeys
        .map(key => `${key}=${dataCheckObj[key]}`)
        .join('\n');

    // Compute the secret key.
    // According to Telegram, the secret key is:
    //   secret_key = HMAC_SHA256("WebAppData", bot_token)
    const secretKey = crypto
        .createHmac('sha256', "WebAppData")
        .update(BOT_TOKEN)
        .digest();

    // Compute the hash over the data-check string using the secret key.
    const computedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // Compare the computed hash with the received hash using a timing-safe comparison.
    const valid = crypto.timingSafeEqual(
        Buffer.from(computedHash, 'hex'),
        Buffer.from(receivedHash, 'hex')
    );

    if (!valid) {
        throw new Error('Invalid initData hash');
    }

    // Return the parsed initData (including the 'user' field and other data).
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
    console.log(initData);
    if (!initData) {
        return res.status(400).json({ error: 'initData is required in the request body' });
    }

    let unpackedData;
    try {
        // Validate and unpack the initData.
        unpackedData = validateAndUnpackInitData(initData);
    } catch (err) {
        console.log("ERROR WITH VALIDATION METHOD")
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