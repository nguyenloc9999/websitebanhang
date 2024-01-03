import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routerProducts from "./routers/products.js";
import routerBrands from "./routers/brands.js";
import routerStatus from "./routers/status.js";
import routerComment from "./routers/comments.js";
import routerAuth from "./routers/auth.js";
import routerCategory from "./routers/category.js";
import uploadRouter from "./routers/upload.js";
import routerOrder from "./routers/order.js";
import cartRouter from "./routers/cart.js";
import routerCoupons from "./routers/coupons.js";
import routerUser from "./routers/user.js";
import routerPayment from "./routers/payments.js";
import cookieParser from "cookie-parser";
import routerColor from "./routers/colors.js";
import routerSize from "./routers/size.js";
import routerPassport from "./routers/passport.js";
import session from 'express-session'
import passport from "passport";
import routerMaterial from "./routers/materials.js";
import routerCustomizedProduct from "./routers/customizedProduct.js";
import routerChildProduct from "./routers/childProduct.js";
import routerStatiscal from "./routers/statistical.js";
import routerNews from "./routers/news.js";
import routerBanner from "./routers/banner.js";
import routerContact from "./routers/contact.js";
import routerFavoriteProducts from "./routers/favoriteProduct.js";
import routerHistory from "./routers/orderHistory.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(session({
    secret: 'DATN',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30 * 60 * 1000 // Thời gian hết hạn cho phiên (30 phút)
    }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routerProducts);
app.use("/api", routerCategory);
app.use("/api", routerBrands);
app.use("/api", routerStatus);
app.use("/api", routerComment);
app.use("/api", routerAuth);
app.use("/api", routerOrder);
app.use("/api", routerCoupons)
app.use("/api", uploadRouter);
app.use("/api", cartRouter);
app.use("/api", routerUser);
app.use("/api", routerPayment);
app.use("/api", routerColor);
app.use("/api", routerSize);
app.use("/api", routerPassport);
app.use("/api", routerMaterial);
app.use("/api", routerCustomizedProduct);
app.use("/api", routerChildProduct);
app.use("/api", routerStatiscal);
app.use("/api", routerNews);
app.use("/api", routerBanner);
app.use("/api", routerContact);
app.use("/api", routerFavoriteProducts);
app.use("/api", routerHistory);

app.listen(8088, async () => {
    await mongoose.connect(process.env.URL_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Server is running 8088");
});
