import express from "express";
import { applyCoupon, changeQuantity, clearUserCart, create, getOne, removeCoupon, removeProduct } from "../controllers/cart.js";

const cartRouter = express.Router();

cartRouter.get("/carts/:id", getOne);
cartRouter.post("/carts/:id/create", create);
cartRouter.delete("/carts/:id/remove", removeProduct);
cartRouter.delete("/carts/:id/clears", clearUserCart);
cartRouter.put("/carts/:id/change", changeQuantity);
cartRouter.patch("/carts/:id/apply", applyCoupon);
cartRouter.patch("/carts/:id/remove-coupon", removeCoupon);


export default cartRouter;
