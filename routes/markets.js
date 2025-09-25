import express from 'express';
import { getMarketFeeds } from '../controllers/marketController.js';

const router = express.Router();

router.get('/feeds', getMarketFeeds);

export default router;
