const productModel = require('../models/productModel');

const getAllProducts = async () => productModel.getAllProducts();

const getProductById = async (id) => productModel.getProductById(id);

module.exports = {
  getAllProducts,
  getProductById,
};