import { getProductBySlug, getSortedProducts } from '../../models/product/product.js';

// Route handler for the faculty list page
const productListPage = async (req, res) => {
    const sort = req.query.sort || 'name';
    const product = await getSortedProducts(sort);
console.log(sort);
    res.render('product/list', {
        title: 'Product List',
        product,
        currentSort: sort
    });
};

// Route handler for individual faculty detail pages
const productDetailPage = async (req, res, next) => {
    const productSlug = req.params.productSlug;
    const product = await getProductBySlug(productSlug);
console.log(productSlug);
console.log(product);
    // If course doesn't exist, create 404 error
    if (Object.keys(product).length === 0) {
        const err = new Error(`Product ${productSlug} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('product/detail', {
        title: product.name,
        product: product
    });
};

export { productListPage, productDetailPage };
