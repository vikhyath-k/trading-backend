const fetch = require('node-fetch');

const getMarketFeeds = async (req, res) => {
  try {
    const response = await fetch('https://openapi.angelbroking.com/rest/secure/market/feed', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SMARTAPI_API_KEY}`,
        'Content-Type': 'application/json',
        apikey: process.env.SMARTAPI_CLIENT_ID
      }
    });

    const data = await response.json();

    const formattedData = {
      indices: data.indices,
      topGainers: data.gainers,
      topLosers: data.losers,
      sectors: data.sectors,
      volumeLeaders: data.volumeLeaders
    };

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching market feeds:', error);
    res.status(500).json({ error: 'Failed to fetch market feeds' });
  }
};

module.exports = { getMarketFeeds };
