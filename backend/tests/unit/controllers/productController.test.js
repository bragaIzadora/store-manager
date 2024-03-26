const { assert } = require('chai');
const sinon = require('sinon');
const { expect } = require('chai');
const db = require('../../../src/models/db');
const productController = require('../../../src/controllers/productController');
const productService = require('../../../src/services/productService');
const productModel = require('../../../src/models/productModel');

describe('Product Controller', function () {
  describe('GET /products', function () {
    it('deve listar todos os produtos', async function () {
      const mockProducts = [
        { id: 1, name: 'Martelo de Thor' },
        { id: 2, name: 'Traje de encolhimento' },
      ];

      const req = {};
      const res = { json: sinon.stub().returnsThis(), status: sinon.stub().returnsThis() };

      sinon.stub(productService, 'getAllProducts').resolves(mockProducts);

      await productController.getAllProducts(req, res);

      expect(res.status.calledWith(200)).to.equal(true);
      expect(res.json.calledWith(mockProducts)).to.equal(true);

      productService.getAllProducts.restore();
    });

    it('deve retornar um produto especifico', async function () {
      const mockProduct = { id: 1, name: 'Martelo de Thor' };

      const req = { params: { id: '1' } };
      const res = { json: sinon.stub().returnsThis(), status: sinon.stub().returnsThis() };

      sinon.stub(productService, 'getProductById').resolves(mockProduct);

      await productController.getProductById(req, res);

      expect(res.status.calledWith(200)).to.equal(true);
      expect(res.json.calledWith(mockProduct)).to.equal(true);

      productService.getProductById.restore();
    });

    it('deve retornar um erro quando não existir o produto', async function () {
      const req = { params: { id: '9999' } };
      const res = { json: sinon.stub().returnsThis(), status: sinon.stub().returnsThis() };

      sinon.stub(productService, 'getProductById').resolves(null);

      await productController.getProductById(req, res);

      expect(res.status.calledWith(404)).to.equal(true);
      expect(res.json.calledWith({ message: 'Product not found' })).to.equal(true);

      productService.getProductById.restore();
    });
  });
  it('deve chamar productModel.getProductById(id)', async function () {
    const mockProduct = { id: 1, name: 'Martelo de Thor' };

    sinon.stub(productModel, 'getProductById').resolves(mockProduct);

    const product = await productService.getProductById(1);

    assert.isObject(product);
    assert.deepEqual(product, mockProduct);

    productModel.getProductById.restore();
  });
  it('deve retornar nulo se não encontrar produtos', async function () {
    sinon.stub(db, 'execute').resolves([[]]);

    const product = await productModel.getProductById(9999);

    assert.isNull(product);

    db.execute.restore();
  });
  it('array vazio se não encontrar produtos', async function () {
    sinon.stub(db, 'execute').resolves([[]]);

    const products = await productModel.getAllProducts();

    assert.isArray(products);
    assert.lengthOf(products, 0);

    db.execute.restore();
  });
  it('deve retornar um array vazio se não encontrar nada ', async function () {
    sinon.stub(productModel, 'getAllProducts').resolves([]);

    const products = await productService.getAllProducts();

    assert.isArray(products);
    assert.lengthOf(products, 0);

    productModel.getAllProducts.restore();
  });
});