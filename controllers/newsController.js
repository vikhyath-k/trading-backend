const newsService = require('../services/newsService');

const getNews = async (req, res, next) => {
  try {
    const news = await newsService.fetchNews();
    res.json(news);
  } catch (error) {
    next(error); // Let error handler middleware deal with it
  }
};

module.exports = { getNews };
