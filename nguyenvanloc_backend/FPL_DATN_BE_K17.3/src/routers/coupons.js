import express from 'express';
import { createCoupons, getAllCoupons, getCouponByUser, getOneCoupons, removeCoupons, updateCoupons } from '../controllers/coupons.js';

const routerCoupons = express.Router();

routerCoupons.post("/coupons", createCoupons);
routerCoupons.get("/coupons", getAllCoupons);
routerCoupons.get("/coupons/:id", getOneCoupons);
routerCoupons.delete("/coupons/:id", removeCoupons);
routerCoupons.patch("/coupons/:id", updateCoupons);
routerCoupons.get("/coupon/:userId", getCouponByUser);

export default routerCoupons;