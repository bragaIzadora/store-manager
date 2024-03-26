const productService = require('../services/productService');

const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts();
  res.status(200).json(products);
};

const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProduct = async (req, res) => {
  const { name } = req.body;
  const product = await productService.createProduct(name);
  res.status(201).json(product);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};