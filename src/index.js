const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Не обязателен, если Railway подставит переменные

const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);


const app = express();

const pool = require('./db/connection');
app.use(express.json());
app.use(cookieParser());
const sessionStore = new MySQLStore({}, pool);

// app.use(cors());
app.use(bodyParser.json());


app.use(cors({
    origin: 'https://zhiroazhigatel.netlify.app', // Укажите URL вашего фронтенда
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Разрешите отправку cookies/credentials
    allowedHeaders: ['Content-Type']
}));



// Set up express-session middleware.
app.use(session({
    key: 'session_cookie_name', // Name of the cookie to be set
    secret: process.env.SESSION_SECRET || 'your_secret_key_here', // Change this for production!
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Session expires after 24 hours
        // secure: true, // Enable when using HTTPS in production
        httpOnly: true,
        sameSite: true,


    }
}));


// Import and mount the auth routes.
const authRoutes = require('./management/auth');
app.use('/auth', authRoutes);


// routes connections
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



// routes application
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

app.use((req, res, next) => {

    console.log('Session:', req.session);
    console.log('Cookies:', req.cookies);
    next();
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, '::', () => {
    console.log(`Server listening on [::]${PORT}`);
});