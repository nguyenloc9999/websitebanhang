import express from "express";
import {
  createFavoriteProduct,
  getAllFavoriteProducts,
  getFavoriteProducts,
  removeFavoriteProduct,
} from "../controllers/favoriteProduct.js";
import { authenticate } from "../middlewares/authenticate.js";

const routerFavoriteProducts = express.Router();

routerFavoriteProducts.post("/favoriteProduct/:id",authenticate, createFavoriteProduct);
routerFavoriteProducts.get("/favoriteProduct", getFavoriteProducts);
routerFavoriteProducts.get("/favoriteProduct/:id", getAllFavoriteProducts);
routerFavoriteProducts.delete("/favoriteProduct/:id", removeFavoriteProduct);
export default routerFavoriteProducts;
