const { getMarketData } = require('../services/marketService');

const fetchMarkets = async (req, res, next) => {
  try {
    const data = await getMarketData();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error); // handled by errorHandler middleware
  }
};

module.exports = { fetchMarkets };
