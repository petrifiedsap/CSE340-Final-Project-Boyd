import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createOrderForm, getAllOrderForms } from '../../models/forms/order.js';

const router = Router();

/**
 * Display the order form page.
 */
const showOrderForm = (req, res) => {
    res.render('forms/order/form', {
        title: 'Contact Us'
    });
};

/**
 * Handle contact form submission with validation.
 * If validation passes, save to database and redirect.
 * If validation fails, log errors and redirect back to form.
 */
const handleOrderSubmission = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Log validation errors for developer debugging
        console.error('Validation errors:', errors.array());
        // Redirect back to form without saving
        return res.redirect('/order');
    }

    // Extract validated data
    const { subject, message } = req.body;

    try {
        // Save to database
        await createOrderForm(subject, message);
        console.log('Order form submitted successfully');
        // Redirect to responses page on success
        res.redirect('/order/responses');
    } catch (error) {
        console.error('Error saving contact form:', error);
        res.redirect('/order');
    }
};

/**
 * Display all contact form submissions.
 */
const showOrderResponses = async (req, res) => {
    let orderForms = [];

    try {
        orderForms = await getAllOrderForms();
    } catch (error) {
        console.error('Error retrieving order forms:', error);
    }

    res.render('forms/order/responses', {
        title: 'Order Form Submissions',
        orderForms
    });
};

/**
 * GET /contact - Display the contact form
 */
router.get('/', showOrderForm);

/**
 * POST /contact - Handle contact form submission with validation
 */
router.post('/',
    [
        body('subject')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Subject must be at least 2 characters'),
        body('message')
            .trim()
            .isLength({ min: 10 })
            .withMessage('Message must be at least 10 characters')
    ],
    handleOrderSubmission
);

/**
 * GET /contact/responses - Display all contact form submissions
 */
router.get('/responses', showOrderResponses);

export default router;