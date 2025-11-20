import { createProduct, 
    getProduct,
    deleteProduct, 
    updateProduct, 
    getProductById, 
    getProductByCategory, 
    getProductBySkin,
    searchProduct} from "../controllers/productController.js";
import express from 'express';

const productRouter = express.Router();

productRouter.route('/').post(createProduct).get(getProduct);
productRouter.route('/categories/:category').get(getProductByCategory);
productRouter.route('/skintypes/:skinType').get(getProductBySkin);
productRouter.route('/search/:query').get(searchProduct);
productRouter.route('/:productId').get(getProductById).delete(deleteProduct).put(updateProduct);

export default productRouter;