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
    const orderByClause = sortBy === 'name' ? 'p.name';
    
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
        firstName: faculty.first_name,
        lastName: faculty.last_name,
        name: `${faculty.first_name} ${faculty.last_name}`,
        office: faculty.office,
        phone: faculty.phone,
        email: faculty.email,
        department: faculty.department_name,
        departmentCode: faculty.department_code,
        title: faculty.title,
        gender: faculty.gender,
        slug: faculty.slug
    }));
};

/**
 * Get all faculty members in a specific department.
 * 
 * @param {number} departmentId - The ID of the department
 * @param {string} sortBy - Sort option: 'name' (default), 'department', 'title'
 * @returns {Promise<Array>} Array of faculty objects in the specified department
 */
const getFacultyByDepartment = async (departmentId, sortBy = 'name') => {
    const orderByClause = sortBy === 'name' ? 'f.last_name, f.first_name' :
                          sortBy === 'title' ? 'f.title, f.last_name' :
                          'd.name, f.last_name, f.first_name';
    
    // WHERE clause filters to only faculty in the specified department
    const query = `
        SELECT f.id, f.first_name, f.last_name, f.office, f.phone, f.email, 
               f.title, f.gender, f.slug, d.name as department_name, d.code as department_code
        FROM faculty f
        JOIN departments d ON f.department_id = d.id
        WHERE f.department_id = $1
        ORDER BY ${orderByClause}
    `;
    
    const result = await db.query(query, [departmentId]);
    
    return result.rows.map(faculty => ({
        id: faculty.id,
        firstName: faculty.first_name,
        lastName: faculty.last_name,
        name: `${faculty.first_name} ${faculty.last_name}`,
        office: faculty.office,
        phone: faculty.phone,
        email: faculty.email,
        department: faculty.department_name,
        departmentCode: faculty.department_code,
        title: faculty.title,
        gender: faculty.gender,
        slug: faculty.slug
    }));
};

/**
 * Wrapper functions for cleaner API - these make the code more readable at the call site.
 * Example: getFacultyById(5) is clearer than getFaculty(5, 'id')
 */
const getFacultyById = (facultyId) => getFaculty(facultyId, 'id');
const getFacultyBySlug = (facultySlug) => getFaculty(facultySlug, 'slug');

export { getFacultyById, getFacultyBySlug, getSortedFaculty, getFacultyByDepartment };