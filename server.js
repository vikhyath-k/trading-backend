// API gateway for the backend
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
const newsRoutes = require('./routes/newsRoutes');
app.use('/api/news', newsRoutes);

// Market feeds route
const marketRoutes = require('./routes/marketRoutes'); // new route
app.use('/api/market', marketRoutes);

// Error Handling Middleware (optional)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
