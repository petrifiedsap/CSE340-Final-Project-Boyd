// import statements from controllers and middleware
import { homePage, aboutPage, aboutMulch } from './index.js';
import { productListPage, productDetailPage } from './product/product.js';
import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import cartRoutes from './cart/cart.js';

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

router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
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
router.get('/about_mulch', aboutMulch);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

// Mulch info routes
router.get('/product', productListPage);
router.get('/product/:productSlug', productDetailPage);

//cart routes
router.use('/cart', cartRoutes);

// Contact form routes
router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// Login routes (form and submission)
router.use('/login', loginRoutes);

export default router;