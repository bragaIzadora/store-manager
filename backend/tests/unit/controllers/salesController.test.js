const { assert } = require('chai');
const express = require('express');
const sinon = require('sinon');
const db = require('../../../src/models/db');
const saleModel = require('../../../src/models/saleModel');
const saleService = require('../../../src/services/saleService');
const saleController = require('../../../src/controllers/saleController');
const saleRoutes = require('../../../src/controllers/saleRoutes');

const app = express();
app.use('/sales', saleRoutes);

const data = '2022-01-01';

describe('saleModel', function () {
  it('deve retornar um array de sales', async function () {
    const sales = await saleModel.getAllSales();
    assert.isArray(sales);
  });

  it('deve chamar saleModel.getAllSales', async function () {
    const sales = await saleService.getAllSales();
    assert.isArray(sales);
  });
  it('deve chamar saleService.getAllSales() e retornar sales', async function () {
    const mockSales = [{ saleId: 1, productId: 1 }, { saleId: 2, productId: 2 }];
    sinon.stub(saleService, 'getAllSales').resolves(mockSales);

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await saleController.getAllSales(req, res);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, mockSales);

    saleService.getAllSales.restore();
  });

  it('deve retornar 404 se sales não for encontrada', async function () {
    sinon.stub(saleService, 'getSaleById').resolves(null);

    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await saleController.getSaleById(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, { message: 'Sale not found' });

    saleService.getSaleById.restore();
  });
  it('deve chamar saleService.getSaleById(id) e retornar sale', async function () {
    const mockSale = { saleId: 1, productId: 1 };
    sinon.stub(saleService, 'getSaleById').resolves(mockSale);

    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await saleController.getSaleById(req, res);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, mockSale);

    saleService.getSaleById.restore();
  });
  it('se naõ encontrar deve retornar null', async function () {
    sinon.stub(db, 'execute').resolves([[]]);

    const sale = await saleModel.getSaleById(999);

    assert.isNull(sale);

    db.execute.restore();
  });
  it('deve retornar sale dos ids', async function () {
    const mockSale = [
      { date: data, productId: 101, quantity: 2 },
      { date: data, productId: 102, quantity: 3 },
    ];

    sinon.stub(db, 'execute').resolves([mockSale]);

    const sale = await saleModel.getSaleById(1);

    assert.isArray(sale);
    assert.deepEqual(sale, mockSale);

    db.execute.restore();
  });
  it('deve retornar um map com as datas corretas', async function () {
    const mockDbResponse = [
      {
        date: data,
        productId: 101,
        quantity: 2,
      },
    ];

    sinon.stub(db, 'execute').resolves([mockDbResponse]);

    const sale = await saleModel.getSaleById(1);

    const expectedSale = [
      {
        date: data,
        productId: 101,
        quantity: 2,
      },
    ];

    assert.deepEqual(sale, expectedSale);

    db.execute.restore();
  });
  it('retorna array', async function () {
    const mockSales = [
      { saleId: 1, date: '2022-01-01', productId: 101, quantity: 2 },
      { saleId: 2, date: '2022-01-02', productId: 102, quantity: 3 },
    ];

    sinon.stub(saleModel, 'getAllSales').resolves(mockSales);

    const sales = await saleService.getAllSales();

    assert.isArray(sales);
    assert.deepEqual(sales, mockSales);

    saleModel.getAllSales.restore();
  });
  it('deve retornar sales dos ids', async function () {
    const mockSale = {
      date: '2022-01-01',
      productId: 101,
      quantity: 2,
    };

    sinon.stub(saleModel, 'getSaleById').withArgs(1).resolves(mockSale);

    const sale = await saleService.getSaleById(1);

    assert.isObject(sale);
    assert.deepEqual(sale, mockSale);

    saleModel.getSaleById.restore();
  });
  it('erros de banco de dados', async function () {
    const error = new Error('Database error');
    sinon.stub(saleModel, 'getSaleById').rejects(error);

    try {
      await saleService.getSaleById(1);
      assert.fail('Expected an error to be thrown');
    } catch (err) {
      assert.strictEqual(err, error);
    }

    saleModel.getSaleById.restore();
  });
  it('resultado vazio do banco de dados', async function () {
    sinon.stub(saleModel, 'getSaleById').resolves([]);

    const sale = await saleService.getSaleById(1);

    assert.isArray(sale);
    assert.lengthOf(sale, 0);

    saleModel.getSaleById.restore();
  });
});
