import db from '../db.js';

/**
 * Core function to get a single faculty member by ID or slug.
 * This pattern (one function with a type parameter) reduces duplicate code.
 * 
 * @param {string|number} identifier - Faculty ID or slug
 * @param {string} identifierType - 'id' or 'slug' (default: 'id')
 * @returns {Promise<Object>} Faculty object with department info, or empty object if not found
 */
const getProducts = async (identifier, identifierType = 'id') => {
    // Build WHERE clause dynamically - search by slug or id
    const whereClause = identifierType === 'slug' ? 'p.slug = $1' : 'p.id = $1';
    
    const query = `
        SELECT p.id, p.name, p.description, p.color, p.premium, 
        p.base_price, p.price_installed, p.slug
        FROM products p
        WHERE ${whereClause}
    `;
    
    const result = await db.query(query, [identifier]);
    
    // Return empty object if faculty member not found
    if (result.rows.length === 0) return {};
    
    const product = result.rows[0];
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        color: product.color,
        premium: product.premium,
        basePrice: product.base_price,
        priceInstalled: product.price_installed,
        slug: product.slug
    };
};

/**
 * Get all faculty members with optional sorting.
 * 
 * @param {string} sortBy - Sort option: 'department' (default), 'name', 'title'
 * @returns {Promise<Array>} Array of faculty objects sorted by the specified field
 */
const getSortedProducts = async (sortBy = 'color') => {
    /**
     * Build ORDER BY clause - notice we sort by last_name, then first_name for names.
     * This is the standard way to alphabetize people's names.
     */
    const orderByClause = sortBy === 'name' ? 'p.name, p.color' :
                          sortBy === 'title' ? 'p.id, p.name' :
                          'p.name, p.base_price, p.price_installed';
    
    const query = `
        SELECT p.id, p.name, p.description, p.color, p.premium, 
               p.base_price, p.price_installed, p.slug
        FROM products p
        ORDER BY ${orderByClause}
    `;
    
    const result = await db.query(query);
    
    // Transform each row from database format to JavaScript format
    return result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        color: product.color,
        premium: product.premium,
        basePrice: product.base_price,
        priceInstalled: product.price_installed,
        slug: product.slug
    }));
};

/**
 * Get all faculty members in a specific department.
 * 
 * @param {number} departmentId - The ID of the department
 * @param {string} sortBy - Sort option: 'name' (default), 'department', 'title'
 * @returns {Promise<Array>} Array of faculty objects in the specified department
 */
const getProductsByPrice = async (departmentId, sortBy = 'price') => {
    const orderByClause = sortBy === 'price' ? 'p.base_price' :
                          sortBy === 'title' ? 'p.id, p.name' :
                          'p.name, p.base_price, p.price_installed';
    
    // WHERE clause filters to only faculty in the specified department
    const query = `
         SELECT p.id, p.name, p.description, p.color, p.premium, 
               p.base_price, p.price_installed, p.slug
        FROM products p
        ORDER BY ${orderByClause}
    `;
    
    const result = await db.query(query, [base_price]);
    
    return result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        color: product.color,
        premium: product.premium,
        basePrice: product.base_price,
        priceInstalled: product.price_installed,
        slug: product.slug
    }));
};

/**
 * Wrapper functions for cleaner API - these make the code more readable at the call site.
 * Example: getFacultyById(5) is clearer than getFaculty(5, 'id')
 */
const getProductById = (productId) => getProducts(productId, 'id');
const getProductBySlug = (productSlug) => getProducts(productSlug, 'slug');

export { getProductById, getProductBySlug, getSortedProducts, getProductsByPrice };