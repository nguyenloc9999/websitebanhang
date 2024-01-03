import express from "express"
import { createOrder, getAllOrder, getOrderById, getOrderByUserId, removeOrder, updateOrder, updateOrderStatus } from "../controllers/order.js";


const routerOrder = express.Router();

routerOrder.post("/order", createOrder);
routerOrder.get("/order/:id", getOrderById)
routerOrder.delete("/order/:id", removeOrder);
routerOrder.get("/order/:userId/user", getOrderByUserId);
routerOrder.get("/order", getAllOrder)
routerOrder.patch("/order/:id", updateOrder);
routerOrder.patch("/order-status/:id", updateOrderStatus);
export default routerOrder;