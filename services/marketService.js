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

    // Add fallback data if API fails
    const fallbackData = {
      indices: [
        { name: 'NIFTY 50', value: '19,850.25', change: '+125.50', changePercent: '+0.64%', trend: 'up' },
        { name: 'SENSEX', value: '66,123.45', change: '+425.30', changePercent: '+0.65%', trend: 'up' },
        { name: 'BANK NIFTY', value: '44,567.89', change: '+89.12', changePercent: '+0.20%', trend: 'up' }
      ],
      topGainers: [
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.78', change: '+45.67', changePercent: '+1.89%' },
        { symbol: 'TCS', name: 'Tata Consultancy', price: '3,234.56', change: '+67.89', changePercent: '+2.15%' },
        { symbol: 'HDFC', name: 'HDFC Bank', price: '1,567.89', change: '+23.45', changePercent: '+1.52%' }
      ],
      topLosers: [
        { symbol: 'INFY', name: 'Infosys', price: '1,234.56', change: '-12.34', changePercent: '-0.99%' },
        { symbol: 'WIPRO', name: 'Wipro', price: '456.78', change: '-5.67', changePercent: '-1.23%' }
      ],
      volumeLeaders: [
        { symbol: 'RELIANCE', name: 'Reliance Industries', volume: '1,234,567', price: '2,456.78', change: '+1.89%' },
        { symbol: 'TCS', name: 'Tata Consultancy', volume: '987,654', price: '3,234.56', change: '+2.15%' }
      ]
    };

    // Try to fetch real data, fallback to mock data if API fails
    let apiSuccess = false;
    
    try {
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
          apiSuccess = true;
        } catch (error) {
          console.error(`Error fetching data for ${symbol.tradingsymbol}:`, error.message);
        }
      }
    } catch (error) {
      console.error('SmartAPI connection failed:', error.message);
    }

    // If API failed, return fallback data
    if (!apiSuccess) {
      console.log('Using fallback market data');
      return fallbackData;
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
