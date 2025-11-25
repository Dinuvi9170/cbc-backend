import express from 'express';
import { getTrendingProducts, incrementAddToCart, incrementViews } from '../controllers/trendingNow.js';

const TrendingRouter= express.Router();

TrendingRouter.post("/view/:productId", incrementViews);
TrendingRouter.post("/cart/:productId", incrementAddToCart);
TrendingRouter.get('/trendingproducts',getTrendingProducts);

export default TrendingRouter;