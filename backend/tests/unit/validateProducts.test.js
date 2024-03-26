const { expect } = require('chai');
const sinon = require('sinon');
const validateProduct = require('../../src/middlewares/vaidateProduct');

describe('validateProduct middleware', function () {
  let req;
  let res;
  let next;

  beforeEach(function () {
    req = { body: {} };
    res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
      },
    };
    next = sinon.spy();
  });

  it('se faltar o name deve retornar 404', function () {
    validateProduct(req, res, next);
    expect(res.statusCode).to.equal(400);
    expect(res.body).to.deep.equal({ message: '"name" is required' });
    expect(next.called).to.equal(false);
  });

  it('se o nome tiver menos que 5 deve retornar 422', function () {
    req.body.name = 'test';
    validateProduct(req, res, next);
    expect(res.statusCode).to.equal(422);
    expect(res.body).to.deep.equal({ message: '"name" length must be at least 5 characters long' });
    expect(next.called).to.equal(false);
  });

  it('se a validação passar deve chamar next()', function () {
    req.body.name = 'productTest';
    validateProduct(req, res, next);
    expect(next.calledOnce).to.equal(true);
  });
});