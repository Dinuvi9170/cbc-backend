import { createOrder, GetOrder } from "../controllers/orderController.js";
import express from 'express';

const OrderRouter= express.Router();

OrderRouter.route('/').post(createOrder).get(GetOrder);

export default OrderRouter;