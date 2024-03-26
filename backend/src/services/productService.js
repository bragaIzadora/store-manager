const productModel = require('../models/productModel');

const getAllProducts = async () => productModel.getAllProducts();

const getProductById = async (id) => productModel.getProductById(id);

const createProduct = async (name) => productModel.createProduct(name);

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};