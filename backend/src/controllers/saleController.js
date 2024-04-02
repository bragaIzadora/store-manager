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
const createSale = async (req, res) => {
  const items = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Items array is required' });
  }

  const saleId = await saleService.createSale();
  await saleService.addSaleItem(saleId, items);

  const sale = {
    id: saleId,
    itemsSold: items,
  };

  res.status(201).json(sale);
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
};