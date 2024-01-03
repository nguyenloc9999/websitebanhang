import express from "express";
import { addProduct, get, getAll, getAllDelete, getTopSellingProducts, remove, removeForce, restoreProduct, updateProduct, viewProduct } from "../controllers/products.js";
import { authorization } from "../middlewares/authorization.js";
import { authenticate } from "../middlewares/authenticate.js";
const routerProducts = express.Router();

routerProducts.get("/products", getAll);
routerProducts.get("/products/delete", getAllDelete);
routerProducts.get("/products/:id", get);
routerProducts.delete("/products/:id", authenticate, authorization, remove);
routerProducts.delete("/products/force/:id", authenticate, authorization, removeForce);
routerProducts.post("/products", authenticate, authorization, addProduct);
routerProducts.patch("/products/:id", updateProduct);
routerProducts.patch("/products/restore/:id", authenticate, authorization, restoreProduct);
routerProducts.get("/products/views/:id", viewProduct);
routerProducts.get("/products-sell", getTopSellingProducts);


export default routerProducts;