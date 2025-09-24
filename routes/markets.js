const express = require('express');
const { fetchMarkets } = require('../controllers/marketsController');

const router = express.Router();

router.get('/', fetchMarkets);

module.exports = router;
