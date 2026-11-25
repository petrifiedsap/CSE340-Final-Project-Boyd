// used AI for help with this file
import { Router } from 'express';
import { requireLogin } from '../../middleware/auth.js';
import { getCartProducts } from '../../models/cart/cart.js';

const router = Router();

// GET /cart - Display the shopping cart
const showCart = async (req, res) => {
    const sessionCart = req.session.cart || [];

    // Extract unique product IDs from the session cart
    const productIds = [...new Set(sessionCart.map(item => item.productId))];
    const products = await getCartProducts(productIds);

    let grandTotal = 0;

    // Combine session quantities/options with fresh database prices
    const cartItems = sessionCart.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;

        const unitPrice = product[item.priceField] || product.basePrice;
        const lineTotal = unitPrice * item.quantity;
        grandTotal += lineTotal;

        return {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            color: product.color,
            priceField: item.priceField,
            optionLabel: item.priceField === 'priceInstalled' ? 'Installed' : 'Material Only',
            unitPrice,
            quantity: item.quantity,
            lineTotal
        };
    }).filter(Boolean); // Removes any item if the product was deleted from DB

    res.render('cart/index', {
        title: 'Your Shopping Cart',
        cartItems,
        grandTotal
    });
};

// POST /cart/add - Add an item to the session cart
const addToCart = (req, res) => {
    const productId = parseInt(req.body.productId, 10);
    const quantity = Math.max(1, parseInt(req.body.quantity, 10) || 1);

    // Whitelist allowed price fields
    const allowedFields = ['basePrice', 'priceInstalled'];
    const priceField = allowedFields.includes(req.body.priceField)
        ? req.body.priceField
        : 'basePrice';

    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Check if the exact same product + installation option is already in the cart
    const existingItem = req.session.cart.find(
        item => item.productId === productId && item.priceField === priceField
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        req.session.cart.push({ productId, quantity, priceField });
    }

    req.flash('success', 'Item added to your cart.');
    res.redirect('/cart');
};

// POST /cart/remove - Remove a specific line item
const removeFromCart = (req, res) => {
    const productId = parseInt(req.body.productId, 10);
    const priceField = req.body.priceField;

    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(
            item => !(item.productId === productId && item.priceField === priceField)
        );
    }

    req.flash('success', 'Item removed from your cart.');
    res.redirect('/cart');
};

router.get('/cart', requireLogin, showCart);
router.post('/cart/add', addToCart);
router.post('/cart/remove', requireLogin, removeFromCart);

export default router;
