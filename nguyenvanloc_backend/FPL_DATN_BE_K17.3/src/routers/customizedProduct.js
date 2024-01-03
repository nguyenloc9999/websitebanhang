import express from "express";
import { createCustomizedProduct, get, getAllCustomProduct, getAllDelete, getAllDeleteById, listCustomizedProducts, remove, removeForce, restoreProduct, updateProduct } from "../controllers/customizedProduct.js";
const routerCustomizedProduct = express.Router();

routerCustomizedProduct.get("/customized-products-list", getAllCustomProduct);
routerCustomizedProduct.get("/CustomProducts/delete/:userId", getAllDeleteById)
routerCustomizedProduct.get("/customized-products/:userId", listCustomizedProducts);
routerCustomizedProduct.get("/CustomProducts/delete", getAllDelete);
routerCustomizedProduct.get("/customized-products/id/:id", get);
routerCustomizedProduct.delete("/customized-products/:id", remove);
routerCustomizedProduct.delete("/customized-products/force/:id", removeForce);
routerCustomizedProduct.post("/customized-products", createCustomizedProduct);
routerCustomizedProduct.patch("/customized-products/:id", updateProduct);
routerCustomizedProduct.patch("/customized-products/restore/:id", restoreProduct);




export default routerCustomizedProduct;