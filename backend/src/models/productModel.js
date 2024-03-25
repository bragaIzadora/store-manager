const db = require('./db');

const getAllProducts = async () => {
  const [products] = await db.execute('SELECT * FROM products');
  return products;
};

const getProductById = async (id) => {
  const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
  return product[0] || null;
};

module.exports = {
  getAllProducts,
  getProductById,
};