const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

/**
 * Middleware to authenticate incoming requests using JWT.
 *
 * Validates the Bearer token in the Authorization header and extracts user information.
 * If the token is missing, invalid, or expired, an error response is returned.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        req.user = user; // Store user data in request object
        console.log("✅User stored in the authenticateJWT ✅", user);
        next();
    });
};

/**
 * Extracts the user ID from the decoded JWT token stored in the request object.
 *
 * @param {Object} req - Express request object containing user details
 * @returns {string|null} - The extracted user ID from the JWT payload
 */
const getUserIdFromToken = (req) => {
    return req.user.userId.id; // Extract userId from the decoded JWT
};

module.exports = {authenticateJWT, getUserIdFromToken};