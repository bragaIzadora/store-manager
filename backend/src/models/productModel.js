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

const updateProduct = async (id, name) => {
  await db.query('UPDATE products SET name = ? WHERE id = ?', [name, id]);
  return { id: Number(id), name };
};

const deleteProduct = async (id) => {
  const result = await db.execute('DELETE FROM products WHERE id = ?', [id]);
  return result[0].affectedRows > 0;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};