// const crypto = require("crypto");
//
// /**
//  * Validates initData received from Telegram WebApp
//  * @param {string} initData - The query string from Telegram (e.g., `auth_date=<timestamp>&...&hash=<hash>`)
//  * @param {string} botToken - Your bot token
//  * @returns {boolean} - Whether the data is valid
//  */
// function validateTelegramData(initData, botToken) {
//     try {
//         // Generate the secret key
//         const secretKey = crypto.createHash("sha256")
//             .update(botToken + "WebAppData")
//             .digest();
//
//         // Parse the initData query string
//         const data = new URLSearchParams(initData);
//
//         // Extract and remove the hash
//         const hash = data.get("hash");
//         if (!hash) {
//             throw new Error("Missing hash in initData");
//         }
//         data.delete("hash");
//
//         // Construct the data-check string
//         const dataCheckString = Array.from(data.entries())
//             .sort(([a], [b]) => a.localeCompare(b))
//             .map(([key, value]) => `${key}=${value}`)
//             .join("\n");
//
//         // Compute HMAC
//         const hmac = crypto.createHmac("sha256", secretKey)
//             .update(dataCheckString)
//             .digest("hex");
//
//         // Validate the hash
//         if (hmac !== hash) {
//             return false; // Data is invalid
//         }
//
//         // Optional: Check the auth_date to prevent outdated data
//         const authDate = parseInt(data.get("auth_date"), 10);
//         const currentTimestamp = Math.floor(Date.now() / 1000);
//         const maxAgeInSeconds = 86400; // 24 hours
//         if (currentTimestamp - authDate > maxAgeInSeconds) {
//             throw new Error("initData is outdated");
//         }
//
//         return true; // Data is valid
//     } catch (error) {
//         console.error("Error validating Telegram data:", error.message);
//         return false;
//     }
// }
//
// module.exports = validateTelegramData;