const salesList = [
  {
    saleId: 1,
    date: '2024-02-26T01:54:09.000Z',
    productId: 1,
    quantity: 5,
  },
  {
    saleId: 1,
    date: '2024-02-26T01:54:09.000Z',
    productId: 2,
    quantity: 10,
  },
  {
    saleId: 2,
    date: '2024-02-26T01:54:09.000Z',
    productId: 3,
    quantity: 15,
  },
];

const insertSaleOne = {
  date: '2023-12-07T13:22:41.000Z',
  productId: 1,
  quantity: 2,
};

const saleListForId = [
  {
    date: '2024-02-26T02:41:55.000Z',
    productId: 1,
    quantity: 5,
  },
  {
    date: '2024-02-26T02:41:55.000Z',
    productId: 2,
    quantity: 10,
  },
];

const postSale = {
  id: 3,
  itemsSold: [
    {
      productId: 1,
      quantity: 1,
    },
    {
      productId: 1,
      quantity: 1,
    },
  ],
};

module.exports = {
  salesList,
  insertSaleOne,
  saleListForId,
  postSale,
};