import express from "express";
import { createHistory, getByOrder } from "../controllers/orderHistory.js";

const routerHistory = express.Router();

routerHistory.get("/history/:orderId", getByOrder);
routerHistory.post("/history", createHistory);

export default routerHistory;