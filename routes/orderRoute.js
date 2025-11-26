import { requireAdmin, requireAuth } from "../controllers/middlewares/Authmiddleware.js";
import { createOrder, GetOrder, GetOrderbyId, updateStatus} from "../controllers/orderController.js";
import express from 'express';

const OrderRouter= express.Router();

OrderRouter.route('/').post(requireAuth,createOrder).get(requireAuth,GetOrder);
OrderRouter.route('/:orderId').get(requireAuth,GetOrderbyId);
OrderRouter.route('/:orderId').put(requireAuth, requireAdmin,updateStatus);

export default OrderRouter;