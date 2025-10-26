import { createOrder, GetOrder, GetOrderbyId} from "../controllers/orderController.js";
import express from 'express';

const OrderRouter= express.Router();

OrderRouter.route('/').post(createOrder).get(GetOrder);
OrderRouter.route('/:orderId').get(GetOrderbyId);

export default OrderRouter;