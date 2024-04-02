const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const saleController = require('../../../src/controllers/saleController');
const saleService = require('../../../src/services/saleService');

chai.use(chaiHttp);
const { expect } = chai;

describe('Sale Controller', function () {
  let req;
  let res;

  beforeEach(function () {
    req = {
      body: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
      ],
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('createSale', function () {
    it('should return 201 and the sale details', async function () {
      sinon.stub(saleService, 'createSale').resolves(1);
      sinon.stub(saleService, 'addSaleItem').resolves();

      await saleController.createSale(req, res);

      expect(res.status.calledWith(201)).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.json.calledWith({ id: 1, itemsSold: req.body })).to.equal(true);
    });

    it('should return 400 if items array is empty', async function () {
      req.body = [];

      await saleController.createSale(req, res);

      expect(res.status.calledWith(400)).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.json.calledWith({ message: 'Items array is required' })).to.equal(true);
    });

    // it('should handle validation errors', async function () {
    //   sinon.stub(saleService, 'createSale').throws(new Error('"productId" is required'));

    //   await saleController.createSale(req, res);

    //   expect(res.status.calledWith(400)).to.equal(true);
    //   expect(res.json.calledOnce).to.equal(true);
    //   expect(res.json.calledWith({ message: '"productId" is required' })).to.equal(true);
    // });
  });
});
