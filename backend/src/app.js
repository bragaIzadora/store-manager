const express = require('express');
const productRoutes = require('./controllers/productRoutes');
const saleRoutes = require('./controllers/saleRoutes');

const app = express();

app.use(express.json());
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.json({ status: 'Store Manager UP!' });
});

module.exports = app;
