import { createOrder, GetOrder, GetOrderbyId, updateStatus} from "../controllers/orderController.js";
import express from 'express';

const OrderRouter= express.Router();

OrderRouter.route('/').post(createOrder).get(GetOrder);
OrderRouter.route('/:orderId').get(GetOrderbyId);
OrderRouter.route('/:orderId').put(updateStatus);

export default OrderRouter;