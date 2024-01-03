import express from 'express';
import { MomoSuccess, PayMomo, PayPal, PayPalSuccess, Striper, ZaloPay, ZaloRedirect, depositPaypal, depositSuccess } from '../controllers/payments.js';
const routerPayment = express.Router();

routerPayment.post("/create_momo", PayMomo);
routerPayment.get("/momo", MomoSuccess);
routerPayment.post("/create_pay", PayPal);
routerPayment.get("/success", PayPalSuccess)
routerPayment.get("/momo-deposit", depositSuccess);
routerPayment.get("/create_zalopay", ZaloPay);
routerPayment.get("/paypal_deposit", depositPaypal);
routerPayment.get("/zalopay_success", ZaloRedirect);
routerPayment.post("/create-checkout-session", Striper);

export default routerPayment;

