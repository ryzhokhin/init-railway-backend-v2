// routes/auth.js

const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// Your Telegram Bot Token – set this in your environment variables or replace with your actual token.
const BOT_TOKEN = process.env.BOT_TOKEN;
// console.log('BOT_TOKEN', BOT_TOKEN);


/**
 * Validates and unpacks Telegram initData based on Telegram's guidelines.
 *
 * The steps are:
 *   1. Parse the query string into raw key/value pairs.
 *   2. Remove the 'hash' field from the raw data.
 *   3. Sort the remaining keys alphabetically and join them as "key=value" pairs using '\n'.
 *   4. Compute the secret key as HMAC-SHA256("WebAppData", BOT_TOKEN).
 *   5. Compute the HMAC-SHA256 of the data-check string using the secret key.
 *   6. Compare the computed hash with the received hash.
 *
 * @param {string} initDataStr - The initData string received from Telegram.
 * @returns {Object} - The parsed initData object with the user field parsed as JSON.
 * @throws {Error} - If the hash is missing or invalid.
 */
function validateAndUnpackInitData(initDataStr) {
    // Parse the query string into an object and keep a copy of the raw values.
    const params = new URLSearchParams(initDataStr);
    const rawData = {};
    const parsedData = {}; // This will hold the parsed values (e.g. user as an object).

    for (const [key, value] of params.entries()) {
        rawData[key] = value;
        // For convenience, parse "user" for later use—but note we use the raw value for hashing.
        if (key === 'user') {
            try {
                parsedData[key] = JSON.parse(value);
            } catch (err) {
                parsedData[key] = value;
            }
        } else {
            parsedData[key] = value;
        }
    }

    // Ensure the 'hash' parameter exists.
    const receivedHash = rawData.hash;
    if (!receivedHash) {
        throw new Error('Missing hash in initData');
    }

    // Build the data-check object using the raw values.
    const dataCheckObj = { ...rawData };
    delete dataCheckObj.hash;

    // Create the data-check string:
    //   1. Sort the keys alphabetically.
    //   2. Join them as "key=value" pairs with a newline as the separator.
    const sortedKeys = Object.keys(dataCheckObj).sort();
    const dataCheckString = sortedKeys
        .map(key => `${key}=${dataCheckObj[key]}`)
        .join('\n');

    // For debugging: log the data-check string.
    // console.log('Data Check String:\n', dataCheckString);

    // Compute the secret key:
    // secret_key = HMAC_SHA256("WebAppData", BOT_TOKEN)
    const secretKey = crypto
        .createHmac('sha256', "WebAppData")
        .update(BOT_TOKEN)
        .digest();

    // Compute the hash over the data-check string using the secret key.
    const computedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // console.log('Computed Hash:', computedHash);
    // console.log('Received Hash:', receivedHash);

    // Validate the computed hash against the received hash.
    const valid = crypto.timingSafeEqual(
        Buffer.from(computedHash, 'hex'),
        Buffer.from(receivedHash, 'hex')
    );

    if (!valid) {
        console.log('***** ERROR IN THE VALIDATION *****')
        throw new Error('Invalid initData hash');
    }

    // Return the parsed data (with the "user" field parsed as an object)
    // console.log(parsedData);
    // console.log("🟨🟨🟨️ Line breaker 🟨🟨🟨️");
    return parsedData;
}

/**
 * POST /auth/login
 *
 * Expects a JSON body with an "initData" field containing the Telegram initData (query string).
 * If valid, the user's data is stored in the session.
 */
router.post('/login', (req, res) => {
    const { initData } = req.body;
    // console.log(initData);
    // console.log("🟨🟨🟨️ Line breaker 🟨🟨🟨️");
    res.cookie("hello", "world", {maxAge: 60000})
    console.log("❔🍪",req.cookies);
    console.log("👅🍪",res.cookies);
    console.log(req.headers.cookie);


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

    // console.log("Telegram user in unpacked data:", telegramUser);
    // console.log("🟨🟨🟨️ Line breaker 🟨🟨🟨️");
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