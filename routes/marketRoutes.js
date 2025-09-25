const express = require('express');
const router = express.Router();
const { getMarketData } = require('../services/marketService');

// Endpoint to get market feeds
router.get('/feeds', async (req, res) => {
  try {
    const marketData = await getMarketData();
    res.json(marketData);
  } catch (err) {
    console.error('Error fetching market feeds:', err);
    res.status(500).json({ error: 'Failed to fetch market feeds' });
  }
});

module.exports = router;
