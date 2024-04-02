const productModel = require('../models/productModel');
const db = require('../models/db');

const getAllProducts = async () => productModel.getAllProducts();

const getProductById = async (id) => productModel.getProductById(id);

const createProduct = async (name) => productModel.createProduct(name);

const updateProduct = async (id, name) => {
  const foundProduct = await getProductById(id);
  if (!foundProduct) {
    throw new Error('Product not found');
  }

  if (!name) {
    throw new Error('"name" is required');
  }

  if (name.length < 5) {
    throw new Error('"name" length must be at least 5 characters long');
  }

  await db.execute('UPDATE products SET name = ? WHERE id = ?', [name, id]);

  const updatedProduct = await getProductById(id);
  return updatedProduct;
};

const deleteProduct = async (id) => {
  const product = await productModel.getProductById(id);
  
  if (!product) {
    return null;
  }
  
  await productModel.deleteProduct(id);
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};