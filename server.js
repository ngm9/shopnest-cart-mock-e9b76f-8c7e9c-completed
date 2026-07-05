const express = require('express');
const path = require('path');

const app = express();
const PORT = 3456;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'app')));

app.post('/api/cart/items', (req, res) => {
  const { productId, quantity } = req.body;
  res.status(201).json({
    id: 'item-real-' + Date.now(),
    productId: productId || 'unknown',
    quantity: quantity || 1,
  });
});

app.listen(PORT, () => {
  console.log('ShopNest dev server running on http://localhost:' + PORT);
});
