// import statements from controllers and middleware
import { homePage, aboutPage } from './index.js';
import { productListPage, productDetailPage } from './product/product.js';
import orderRoutes from './forms/order.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

import { Router } from 'express';

// Create a new router instance
const router = Router();

// Router middleware
// Add page-specific styles to all routes
router.use('/product', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/product.css">');
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
router.get('/product', productListPage);
router.get('/product/:slugId', productDetailPage);

// Contact form routes
router.use('/order', orderRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;