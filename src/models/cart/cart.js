import db from '../db.js';

/**
 * Fetch up-to-date product details for all IDs currently in the session cart.
 * @param {Array<number>} productIds - Array of product IDs
 * @returns {Promise<Array>} Array of formatted product objects
 * used AI for assistance with this file
 */
const getCartProducts = async (productIds) => {
    if (!productIds || productIds.length === 0) return [];

    const query = `
        SELECT id, name, color, base_price, price_installed, slug
        FROM products
        WHERE id = ANY($1::int[])
    `;

    const result = await db.query(query, [productIds]);

    return result.rows.map(product => ({
        id: product.id,
        name: product.name,
        color: product.color,
        basePrice: Number(product.base_price),
        priceInstalled: product.price_installed ? Number(product.price_installed) : null,
        slug: product.slug
    }));
};

export { getCartProducts };
