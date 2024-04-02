const productService = require('../services/productService');

const checkProductExists = async (productId) => {
  const product = await productService.getProductById(productId);
  return !!product;
};

const validateSale = async (request, response, next) => {
  const productsSale = request.body;

  const validateId = productsSale.every((id) => id.productId);
  if (!validateId) return response.status(400).json({ message: '"productId" is required' }); 

  const validateQuantity = productsSale.every((quant) => quant.quantity !== undefined);
  if (!validateQuantity) return response.status(400).json({ message: '"quantity" is required' });

  const validate = productsSale.every((quant) => quant.quantity <= 0);
  if (validate) {
    return response.status(422).json({ message: '"quantity" must be greater than or equal to 1' });
  }

  const allProductsExist = await Promise.all(productsSale
    .map((item) => checkProductExists(item.productId)))
    .then((results) => results.every((exists) => exists));

  if (!allProductsExist) {
    return response.status(404).json({ message: 'Product not found' });
  }
  next();
};

module.exports = {
  validateSale,
};