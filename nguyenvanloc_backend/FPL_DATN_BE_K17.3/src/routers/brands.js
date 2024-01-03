import express from "express";
import { createBrand, getAllBrands, getBrand, removeBrand, updateBrand } from "../controllers/brands.js";

const routerBrands = express.Router();

routerBrands.get("/brands", getAllBrands);
routerBrands.get("/brands/:id", getBrand);
routerBrands.delete("/brands/:id", removeBrand);
routerBrands.post("/brands", createBrand);
routerBrands.patch("/brands/:id", updateBrand);


export default routerBrands;