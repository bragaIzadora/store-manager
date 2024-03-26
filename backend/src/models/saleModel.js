const db = require('./db');

const getAllSales = async () => {
  const query = `
  SELECT  sale_id AS saleId, sales.date, product_id AS productId, quantity
  FROM sales_products
  JOIN sales ON sales.id = sales_products.sale_id
  ORDER BY sale_id, product_id;
  `;
  const [sales] = await db.execute(query);
  return sales;
};

const getSaleById = async (id) => {
  const [sale] = await db.execute(`
  SELECT
      sales.date, 
      sales_products.product_id as productId, 
      sales_products.quantity
  FROM sales 
  JOIN sales_products ON sales.id = sales_products.sale_id 
  WHERE sales.id = ? 
  ORDER BY sales.id ASC, sales_products.product_id ASC;`, [id]);
  return sale && sale.length > 0 ? sale.map(({ date, productId, quantity }) => ({
    date,
    productId,
    quantity,
  })) : null;
};

const createSale = async () => {
  const result = await db.execute('INSERT INTO sales (date) VALUES (NOW())');
  return result[0].insertId;
};

const addSaleItem = async (saleId, productId, quantity) => {
  await db.execute(
    'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)', 
    [saleId, productId, quantity],
  );
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  addSaleItem,
};