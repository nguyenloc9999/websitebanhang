import express from "express";
import { getReviewStatistics, getTopSellingProducts, getRevenueAndProfit, getUserStatistics, getTopViewedProducts, getTotalSoldQuantity, getTotalCreatedProducts, getTotalOrder, getSellingProductsData, getOrderUnconfirmed, getOrderConfirmed, getOrderAccomplished, getOrderDelivering, getOrderCanceled } from "../controllers/statistical.js";

const routerStatiscal = express.Router();

routerStatiscal.get('/statistical/orders', getRevenueAndProfit);
routerStatiscal.get('/statistical/products-sell', getTopSellingProducts);
routerStatiscal.get('/statistical/products-selling', getSellingProductsData);
routerStatiscal.get('/statistical/products-view', getTopViewedProducts);
routerStatiscal.get('/statistical/products-sold', getTotalSoldQuantity);
routerStatiscal.get('/statistical/products-total', getTotalCreatedProducts);
routerStatiscal.get('/statistical/order-count', getTotalOrder);
routerStatiscal.get('/statistical/users', getUserStatistics);
routerStatiscal.get('/statistical/comments', getReviewStatistics);
routerStatiscal.get('/statistical/order-unconfirmed', getOrderUnconfirmed);
routerStatiscal.get('/statistical/order-confirmed', getOrderConfirmed);
routerStatiscal.get('/statistical/order-accomplished', getOrderAccomplished);
routerStatiscal.get('/statistical/order-delivering', getOrderDelivering);
routerStatiscal.get('/statistical/order-canceled', getOrderCanceled);
export default routerStatiscal;