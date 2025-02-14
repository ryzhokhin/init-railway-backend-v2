const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables


const app = express();
const pool = require('./db/connection');
const authenticateJWT = require('./management/authMiddleware');


// Middleware for logging (only in development mode)
app.use((req, res, next) => {
    console.log('🚀launched');
    console.log(req.cookies);
    console.log('🛬landed');
    next();
});

// Middleware setup
app.use(express.json());

app.use(cors({
    origin: 'https://zhiroazhigatel.netlify.app', // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies to be sent and received
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Import and mount the auth routes




// Routes connections
const testRoutes = require('./unusedRoutes/test');
const setupRoutes = require('./unusedRoutes/setup');
const userRoutes = require('./routes/users');
const insertMealPlans = require('./unusedRoutes/insertMealPlans');
const guidesRoutes = require('./routes/guides');
const insertMealPlansDays = require('./unusedRoutes/insertMealPlanDays');
const mealPlansRoutes = require('./routes/mealplans');
const user_guidesRoutes = require('./routes/user_guides');
const user_mealplansRoutes = require('./routes/user_mealplans');
const mealsRoutes = require('./routes/mealsRoutes');
const trainingPlansRoutes = require('./routes/trainingPlansRoutes');
const authRoutes = require('./management/auth');

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
app.use('/auth', authRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// ✅ Protected Route Example: Requires JWT Token
app.get('/protected-route', authenticateJWT, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.token });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '::', () => {
    console.log(`Server listening on [::]${PORT}`);
});
