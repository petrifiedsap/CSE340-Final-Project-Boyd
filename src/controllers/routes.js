// import statements from controllers and middleware
import { mulchPage, mulchDetailPage } from './mulch/mulch.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

import { Router } from 'express';

// Create a new router instance
const router = Router();

// Router middleware
// Add page-specific styles to all routes
router.use('/mulch', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/mulch.css">');
    next();
});

router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/register.css">');
    next();
});

router.use('/order', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/order.css">');
    next();
});

router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

// Route definitions
// Home and basic pages
router.get('/', homePage);
router.get('/about_us', aboutPage);

// Mulch info routes
router.get('/mulch', mulchPage);
router.get('/mulch/:slugId', mulchDetailPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

// Contact form routes
router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;