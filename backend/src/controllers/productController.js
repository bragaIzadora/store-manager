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

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const product = await productService.updateProduct(id, name);
    res.status(200).json(product);
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (error.message.startsWith('"name"')) {
      return res.status(422).json({ message: error.message });
    }
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedProduct = await productService.deleteProduct(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};