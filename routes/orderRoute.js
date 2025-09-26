import { createOrder } from "../controllers/orderController.js";
import express from 'express';

const OrderRouter= express.Router();

OrderRouter.route('/').post(createOrder);

export default OrderRouter;