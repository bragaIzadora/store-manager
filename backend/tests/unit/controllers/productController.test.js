const { assert } = require('chai');
const sinon = require('sinon');
const { expect } = require('chai');
const db = require('../../../src/models/db');
const productController = require('../../../src/controllers/productController');
const productService = require('../../../src/services/productService');
const productModel = require('../../../src/models/productModel');

const newProduct = 'New Product';

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
  it('deve criar um novo produto', async function () {
    const mockResult = { insertId: 1 };
    sinon.stub(db, 'execute').resolves([mockResult]);

    const product = await productModel.createProduct(newProduct);

    assert.deepEqual(product, { id: 1, name: newProduct });

    db.execute.restore();
  });
  it('deve chamar createProduct de productModel', async function () {
    const createProductStub = sinon.stub(productModel, 'createProduct').resolves({ id: 1, name: newProduct });

    const product = await productService.createProduct(newProduct);

    assert.deepEqual(product, { id: 1, name: newProduct });
    assert.isTrue(createProductStub.calledOnce);

    productModel.createProduct.restore();
  });
  it('deve chamar createProduct de productService e retornar 201 status', async function () {
    const req = { body: { name: newProduct } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(productService, 'createProduct').resolves({ id: 1, name: newProduct });

    await productController.createProduct(req, res);

    assert(res.status.calledWith(201));
    assert(res.json.calledWith({ id: 1, name: newProduct }));

    productService.createProduct.restore();
  });
  it('retorna 404 se o produto não existirt', async function () {
    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    sinon.stub(productService, 'deleteProduct').returns(null);

    await productController.deleteProduct(req, res);

    expect(res.status.calledWith(404)).to.equal(true);
    expect(res.json.calledWith({ message: 'Product not found' })).to.equal(true);

    productService.deleteProduct.restore();
  });
  it('deleta e retorna 404', async function () {
    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      end: sinon.spy(),
    };

    sinon.stub(productService, 'deleteProduct').returns({ id: 1, name: 'Product' });

    await productController.deleteProduct(req, res);

    expect(res.status.calledWith(204)).to.equal(true);
    expect(res.end.calledOnce).to.equal(true);

    productService.deleteProduct.restore();
  });
  it('retorna nulo se o produto não existir', async function () {
    sinon.stub(productModel, 'getProductById').returns(null);

    const result = await productService.deleteProduct(1);

    expect(result).to.equal(null);

    productModel.getProductById.restore();
  });
  it('deve deletar e retornar o produto', async function () {
    const mockProduct = { id: 1, name: 'Product' };

    sinon.stub(productModel, 'getProductById').returns(mockProduct);
    sinon.stub(productModel, 'deleteProduct').returns(true);

    const result = await productService.deleteProduct(1);

    expect(result).to.deep.equal(mockProduct);

    productModel.getProductById.restore();
    productModel.deleteProduct.restore();
  });
  it('deleta do database', async function () {
    const mockResult = [{ affectedRows: 1 }];
    sinon.stub(db, 'execute').returns(Promise.resolve(mockResult));

    const result = await productModel.deleteProduct(1);

    expect(result).to.equal(true);

    db.execute.restore();
  });
  it('cria novo produto', async function () {
    const mockProduct = { id: 1, name: 'Product 1' };
    sinon.stub(productService, 'createProduct').returns(mockProduct);
    const req = { body: { name: 'Product 1' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await productController.createProduct(req, res);

    expect(res.status.calledWith(201)).to.equal(true);
    expect(res.json.calledWith(mockProduct)).to.equal(true);

    productService.createProduct.restore();
  });

  afterEach(function () {
    sinon.restore();
  });

  it('produto não encontrado', async function () {
    sinon.stub(productService, 'getProductById').returns(null);
    try {
      await productService.updateProduct(1, 'New Product');
    } catch (error) {
      expect(error.message).to.equal('Product not found');
    }
  });
  it('erro sem o nome', async function () {
    sinon.stub(productService, 'getProductById').returns({ id: 1, name: 'Existing Product' });
    try {
      await productService.updateProduct(1, '');
    } catch (error) {
      expect(error.message).to.equal('"name" is required');
    }
  });
  it('nome inválido', async function () {
    const mockProductId = 1;
    const mockProductName = 'Short';
    const req = { params: { id: mockProductId }, body: { name: mockProductName } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    sinon.stub(productService, 'updateProduct').throws(new Error('"name" length must be at least 5 characters long'));
    await productController.updateProduct(req, res);
    expect(res.status.calledWith(422)).to.equal(true);
    expect(res.json.calledWith({ message: '"name" length must be at least 5 characters long' })).to.equal(true);
  });
});