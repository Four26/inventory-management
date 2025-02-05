const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, editProducts, deleteProduct, searchProduct, getAllCategories } = require('../controller/controller');

//add product
router.post('/product', addProduct);

//get all products in dashboard
router.get('/product', getAllProducts);


//edit product
router.put('/product/:id', editProducts);

//delete product
router.delete('/product/:id', deleteProduct);

//search a product
router.get('/product/search', searchProduct);

// get all categories
router.get('/category', getAllCategories);

module.exports = router;