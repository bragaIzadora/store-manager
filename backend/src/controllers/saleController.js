const saleService = require('../services/saleService');

const getAllSales = async (req, res) => {
  const sales = await saleService.getAllSales();
  res.status(200).json(sales);
};

const getSaleById = async (req, res) => {
  const sale = await saleService.getSaleById(req.params.id);
  if (sale) {
    res.status(200).json(sale);
  } else {
    res.status(404).json({ message: 'Sale not found' });
  }
};

module.exports = {
  getAllSales,
  getSaleById,
};