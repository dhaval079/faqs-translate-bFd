// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import expressLayouts from 'express-ejs-layouts';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';

// Load .env file - Add this at the very top before any other code
const result = dotenv.config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Environment variables loaded successfully');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "cdn.ckeditor.com"],
            "img-src": ["'self'", "data:", "cdn.jsdelivr.net"],
        },
    },
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session and Flash setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use((req, res, next) => {
    res.locals.baseUrl = `http://localhost:${process.env.PORT || 3000}`;
    next();
});
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.render('welcome', {
        title: 'Welcome to FAQ Translation System',
        layout: false // Disable the layout for this page
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

export default app;