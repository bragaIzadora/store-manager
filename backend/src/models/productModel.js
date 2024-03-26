const db = require('./db');

const getAllProducts = async () => {
  const [products] = await db.execute('SELECT * FROM products');
  return products;
};

const getProductById = async (id) => {
  const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
  return product[0] || null;
};

const createProduct = async (name) => {
  const result = await db.execute('INSERT INTO products (name) VALUES (?)', [name]);
  return { id: result[0].insertId, name };
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};