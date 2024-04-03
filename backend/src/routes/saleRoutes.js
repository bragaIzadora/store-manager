const express = require('express');

const router = express.Router();
const saleController = require('../controllers/saleController');
const { validateSale } = require('../middlewares/validateSale');

router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSaleById);
// router.post('/', saleController.createSale);
router
  .post('/', validateSale, saleController.createSale);

module.exports = router;