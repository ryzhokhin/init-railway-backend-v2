const session = require("express-session");

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Protect against XSS
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "Lax",
        maxAge: 20 * 60 * 1000 // 20 minutes
    }
});

module.exports = sessionMiddleware;