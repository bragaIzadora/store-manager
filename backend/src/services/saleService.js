const saleModel = require('../models/saleModel');

const getAllSales = async () => saleModel.getAllSales();

const getSaleById = async (id) => saleModel.getSaleById(id);

module.exports = {
  getAllSales,
  getSaleById,
};