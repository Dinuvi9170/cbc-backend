import { createProduct, getProduct,deleteProduct } from "../controllers/productController.js";
import express from 'express';

const productRouter = express.Router();

productRouter.route('/').post(createProduct).get(getProduct);
productRouter.route('/:productId').delete(deleteProduct);

export default productRouter;