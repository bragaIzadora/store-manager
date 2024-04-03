const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');
const validateProduct = require('../middlewares/vaidateProduct');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', validateProduct, productController.createProduct);
router.put('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;