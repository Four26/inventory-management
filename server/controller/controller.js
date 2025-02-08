const pool = require('../db/db');
const asyncHandler = require('express-async-handler');


const addProduct = asyncHandler(async (req, res, next) => {
    const { name, price, quantity, category } = req.body;

    const categoryResult = await pool.query('SELECT id FROM category WHERE name = $1', [category]);

    if (categoryResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid category name' });
    }

    const category_id = categoryResult.rows[0].id;

    const newProduct = await pool.query('INSERT INTO products (name, price, quantity, category_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *', [name, price, quantity, category_id]);

    res.json(newProduct.rows[0]);
});

const getAllProducts = asyncHandler(async (req, res, nex) => {

    const products = await pool.query(`
            SELECT 
                p.id, p.name, p.price, p.quantity, p.created_at, c.name AS category
            FROM products p
            JOIN category c ON p.category_id = c.id
            ORDER BY p.created_at DESC
            LIMIT 8`)
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    const categoryCount = await pool.query('SELECT COUNT(*) FROM category');
    const lowStock = await pool.query('SELECT id, name, quantity FROM products WHERE quantity < 20');
    const totalProductsValue = await pool.query('SELECT SUM(price * quantity) AS total_value FROM products');

    res.json({
        products: products.rows,
        productCount: productCount.rows[0].count,
        categoryCount: categoryCount.rows[0].count,
        lowStock: lowStock.rows,
        totalProductsValue: totalProductsValue.rows[0].total_value
    });
});

const editProducts = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const { name, price, quantity } = req.body;

    const updatedProduct = [
        {
            id,
            name,
            price,
            quantity
        }
    ]

    res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const deletedProduct = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
    );

    if (deletedProduct.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(deletedProduct.rows[0]);
});

const searchProduct = asyncHandler(async (req, res, next) => {

    const { query } = req.query;
    const products = await pool.query(`
            SELECT 
                p.*, c.name AS category
            FROM products p
            JOIN category c ON p.category_id = c.id
            WHERE LOWER(p.name) LIKE LOWER($1)`,
        [`%${query}%`]);

    res.json(products.rows);
});

const getAllCategories = asyncHandler(async (req, res, next) => {

    const categoryCount = await pool.query(` 
            SELECT
                c.id AS category_id,
                c.name AS category_name,
                COUNT(p.id) AS product_count,
                COALESCE(SUM(p.quantity), 0) AS total_quantity,
                COALESCE(SUM(p.price * p.quantity), 0) AS total_value
            FROM category c
            LEFT JOIN products p ON c.id = p.category_id
            GROUP BY c.id, c.name
            ORDER BY c.name;`);

    res.json(categoryCount);
});

module.exports = {
    addProduct,
    getAllProducts,
    searchProduct,
    editProducts,
    deleteProduct,
    getAllCategories
}