const fetch = require('node-fetch');
const { getCachedData, setCachedData } = require('../utils/cache');

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const fetchNews = async () => {
  const cached = getCachedData('news');
  if (cached) return cached;

  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?category=business&apiKey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  const articles = data.articles || [];

  setCachedData('news', articles, CACHE_DURATION);
  return articles;
};

module.exports = { fetchNews };
