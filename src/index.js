const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const pool = require('./db/connection');

// Middleware for logging (only in development mode)
app.use((req, res, next) => {
    console.log('🚀launched');
    console.log(req.cookies);
    console.log('🛬landed');
    next();
});

// Middleware setup
app.use(express.json());
app.use(cookieParser());
const sessionStore = new MySQLStore({}, pool);

app.use(cors({
    origin: 'https://zhiroazhigatel.netlify.app', // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies to be sent and received
    allowedHeaders: ['Content-Type']
}));

// Set up express-session middleware
app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'your_secret_key_here', // Use a strong secret in production
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Session expires after 24 hours
        // secure: process.env.NODE_ENV === 'production', // Enable only in production (HTTPS)
        httpOnly: true,
        sameSite: 'None', // Required for cross-origin cookies
    }
}));

// Import and mount the auth routes
const authRoutes = require('./management/auth');
app.use('/auth', authRoutes);

// Routes connections
const testRoutes = require('./routes/test');
const setupRoutes = require('./routes/setup');
const userRoutes = require('./routes/users');
const insertMealPlans = require('./routes/insertMealPlans');
const guidesRoutes = require('./routes/guides');
const insertMealPlansDays = require('./routes/insertMealPlanDays');
const mealPlansRoutes = require('./routes/mealplans');
const user_guidesRoutes = require('./routes/user_guides');
const user_mealplansRoutes = require('./routes/user_mealplans');
const mealsRoutes = require('./routes/mealsRoutes');
const trainingPlansRoutes = require('./routes/trainingPlansRoutes');

// Route mounting
app.use('/test', testRoutes);
app.use('/setup', setupRoutes);
app.use('/users', userRoutes);
app.use('/mealplans', insertMealPlans);
app.use('/guides', guidesRoutes);
app.use('/mealplans-days', insertMealPlansDays);
app.use('/mealplans', mealPlansRoutes);
app.use('/user_guides', user_guidesRoutes);
app.use('/user_mealplans', user_mealplansRoutes);
app.use('/meals', mealsRoutes);
app.use('/trainings', trainingPlansRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '::', () => {
    console.log(`Server listening on [::]${PORT}`);
});
