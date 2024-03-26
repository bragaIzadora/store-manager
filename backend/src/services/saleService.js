const saleModel = require('../models/saleModel');

const getAllSales = async () => saleModel.getAllSales();

const getSaleById = async (id) => saleModel.getSaleById(id);

const createSale = async () => {
  const saleId = await saleModel.createSale();
  return saleId;
};

const addSaleItem = async (saleId, items) => {
  const promises = items
    .map((item) => saleModel.addSaleItem(saleId, item.productId, item.quantity));
  await Promise.all(promises);
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  addSaleItem,
};