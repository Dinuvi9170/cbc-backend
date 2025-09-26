import { createProduct, getProduct,deleteProduct, updateProduct, getProductById } from "../controllers/productController.js";
import express from 'express';

const productRouter = express.Router();

productRouter.route('/').post(createProduct).get(getProduct);
productRouter.route('/:productId').get(getProductById).delete(deleteProduct).put(updateProduct);

export default productRouter;