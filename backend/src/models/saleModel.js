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

module.exports = {
  getAllSales,
  getSaleById,
};