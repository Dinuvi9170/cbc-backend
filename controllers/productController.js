import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export const createProduct = (req, res) => {
  if (!isAdmin(req)) {
    res
      .status(403)
      .json({ message: "You are not authorized to add products." });
    return;
  }

  const product = new Product(req.body);
  product
    .save()
    .then(() => {
      res.status(201).json({ message: "Product created successfully" });
    })
    .catch((error) => {
      res.status(401).json({ message: "Failed to create product " });
      console.log(error);
    });
};

export const getProduct = async (req, res) => {
  try {
    if (isAdmin(req)) {
      const products = await Product.find();
      return res.status(200).json(products);
    } else {
      const products = await Product.find({ isAvailable: true });
      return res.status(200).json(products);
    }
  } catch (error) {
    res.status(401).json({ message: "Failed to load products " });
    console.log(error);
  }
};

export const deleteProduct = async (req, res) => {
  if (!isAdmin(req)) {
    res
      .status(403)
      .json({ message: "You are not authorized to delete product" });
    return;
  }
  try {
    const { productId } = req.params;
    if (!productId) {
      res.status(400).json({ message: "productId is required" });
      return;
    }
    const product = await Product.findOneAndDelete({
      productId: req.params.productId,
    });
    if (!product) {
      res.status(404).json({ message: "Not found product" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
    console.log(error);
  }
};

export const updateProduct = async (req, res) => {
  if (!isAdmin(req)) {
    res
      .status(403)
      .json({ message: "You are not authorized to update product" });
    return;
  }
  const productId = req.params.productId;
  const updateData = req.body;

  try {
    if (!productId) {
      res.status(400).json({ message: "productId is required" });
      return;
    }
    const product = await Product.findOneAndUpdate(
      { productId: productId },
      updateData
    );
    if (!product) {
      res.status(404).json({ message: "Not found product" });
      return;
    }
    res.status(200).json({ message: "Product updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
    console.log(error);
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findOne({ productId: productId });
    if (product == null) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    if (product.isAvailable) {
      res.status(200).json(product);
    } else {
      if (!isAdmin(req)) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to get product" });
    console.log(error);
  }
};

export const getProductByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ category: category });
    if (products.length === 0) {
      res.status(404).json({ message: `${category} products not found` });
      return;
    }

    const availableproducts= products.filter((product)=>product.isAvailable);
    
    if (availableproducts.length===0){ 
      res.status(404).json({ message: `No available ${category} products` });
      return;
    }
    res.status(200).json(availableproducts);
    
  } catch (error) {
    res.status(500).json({ message: `Failed to get ${category} products` });
    console.log(error);
  }
};
