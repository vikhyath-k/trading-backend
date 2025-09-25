const fetch = require('node-fetch');

// SmartAPI client configuration
const smartApiClient = {
  baseURL: 'https://apiconnect.angelbroking.com',
  
  // Get Last Traded Price
  async getLTP(symbol) {
    try {
      const response = await fetch(`${this.baseURL}/rest/secure/angelbroking/market/v1/quote/LTP`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SMARTAPI_API_KEY}`,
          'Content-Type': 'application/json',
          'X-UserType': 'USER',
          'X-SourceID': 'WEB',
          'X-ClientLocalIP': '192.168.1.1',
          'X-ClientPublicIP': '106.193.147.98',
          'X-MACAddress': '00:00:00:00:00:00',
          'X-PrivateKey': process.env.SMARTAPI_CLIENT_ID
        },
        body: JSON.stringify({
          mode: 'LTP',
          exchangeTokens: [symbol]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SmartAPI LTP Error:', error);
      throw error;
    }
  }
};

module.exports = smartApiClient;
