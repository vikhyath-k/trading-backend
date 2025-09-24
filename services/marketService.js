const smartApi = require('../config/smartApiClient');

const getMarketData = async () => {
  try {
    // Fetch multiple indices and stocks
    const symbols = [
      { exchange: "NSE", tradingsymbol: "NIFTY", symboltoken: "99926009" },
      { exchange: "NSE", tradingsymbol: "SENSEX", symboltoken: "99926001" },
      { exchange: "NSE", tradingsymbol: "BANKNIFTY", symboltoken: "99926017" },
      { exchange: "NSE", tradingsymbol: "RELIANCE-EQ", symboltoken: "2885" },
      { exchange: "NSE", tradingsymbol: "TCS-EQ", symboltoken: "11536" },
      { exchange: "NSE", tradingsymbol: "HDFC-EQ", symboltoken: "341" },
      { exchange: "NSE", tradingsymbol: "INFY-EQ", symboltoken: "1594" }
    ];

    const marketData = {
      indices: [],
      topGainers: [],
      topLosers: [],
      sectors: [
        { name: 'Banking', performance: '+2.34%', trend: 'up' },
        { name: 'IT', performance: '-1.23%', trend: 'down' },
        { name: 'Pharma', performance: '+0.89%', trend: 'up' },
        { name: 'Auto', performance: '+1.56%', trend: 'up' },
        { name: 'FMCG', performance: '+0.67%', trend: 'up' },
        { name: 'Realty', performance: '-0.45%', trend: 'down' }
      ],
      volumeLeaders: []
    };

    // Fetch data for each symbol
    for (const symbol of symbols) {
      try {
        const response = await smartApi.getLTP(symbol);
        const data = response.data;
        
        // Process the data based on symbol type
        if (symbol.tradingsymbol.includes('NIFTY') || symbol.tradingsymbol.includes('SENSEX')) {
          marketData.indices.push({
            name: symbol.tradingsymbol,
            value: data.ltp || '0',
            change: data.change || '0',
            changePercent: data.changePercent || '0%',
            trend: (data.change && parseFloat(data.change) > 0) ? 'up' : 'down'
          });
        } else {
          // For individual stocks
          const stockData = {
            symbol: symbol.tradingsymbol.replace('-EQ', ''),
            name: getStockName(symbol.tradingsymbol),
            price: data.ltp || '0',
            change: data.change || '0',
            changePercent: data.changePercent || '0%',
            volume: data.volume || '0'
          };
          
          if (data.change && parseFloat(data.change) > 0) {
            marketData.topGainers.push(stockData);
          } else {
            marketData.topLosers.push(stockData);
          }
          
          marketData.volumeLeaders.push(stockData);
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol.tradingsymbol}:`, error.message);
      }
    }

    return marketData;
  } catch (error) {
    console.error("SmartAPI Market Data Error:", error.message);
    throw new Error("Unable to fetch market data.");
  }
};

// Helper function to get stock names
const getStockName = (symbol) => {
  const stockNames = {
    'RELIANCE-EQ': 'Reliance Industries',
    'TCS-EQ': 'Tata Consultancy',
    'HDFC-EQ': 'HDFC Bank',
    'INFY-EQ': 'Infosys',
    'WIPRO-EQ': 'Wipro',
    'TECHM-EQ': 'Tech Mahindra',
    'HCLTECH-EQ': 'HCL Technologies',
    'LT-EQ': 'Larsen & Toubro'
  };
  return stockNames[symbol] || symbol.replace('-EQ', '');
};

// Get specific stock data
const getStockData = async (symbol) => {
  try {
    const response = await smartApi.getLTP({
      exchange: "NSE",
      tradingsymbol: symbol,
      symboltoken: getSymbolToken(symbol)
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error.message);
    throw new Error(`Unable to fetch data for ${symbol}`);
  }
};

// Helper function to get symbol tokens (you'll need to maintain this mapping)
const getSymbolToken = (symbol) => {
  const symbolTokens = {
    'RELIANCE-EQ': '2885',
    'TCS-EQ': '11536',
    'HDFC-EQ': '341',
    'INFY-EQ': '1594',
    'WIPRO-EQ': '5070',
    'TECHM-EQ': '4684',
    'HCLTECH-EQ': '7229',
    'LT-EQ': '3172'
  };
  return symbolTokens[symbol] || '99926009'; // Default to NIFTY if not found
};

module.exports = { getMarketData, getStockData };
