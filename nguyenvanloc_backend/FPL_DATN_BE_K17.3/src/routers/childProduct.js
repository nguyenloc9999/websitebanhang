import express from "express";
import { createChildProduct, getChildProduct, getChildProductPrice, listChildProducts, removeChildProduct, updateChildProduct } from "../controllers/childProduct.js";
const routerChildProduct = express.Router();

routerChildProduct.get("/child-products/:productId", listChildProducts);
routerChildProduct.get("/child-product/:id", getChildProduct);
routerChildProduct.get('/get-child-product', getChildProductPrice);
routerChildProduct.delete("/child-products/:id", removeChildProduct);
routerChildProduct.post("/child-products", createChildProduct);
routerChildProduct.patch("/child-product/:id", updateChildProduct);

export default routerChildProduct;