const express = require('express');

const router = express.Router();
const saleController = require('./saleController');

router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSaleById);

module.exports = router;