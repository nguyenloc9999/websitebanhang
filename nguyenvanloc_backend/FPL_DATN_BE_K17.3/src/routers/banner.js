import express from 'express';
import { createBanner, deleteBanner, getAllBanners, getBannerById, updateBanner } from '../controllers/banner.js';
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from '../middlewares/authorization.js';


const routerBanner = express.Router();

routerBanner.post('/banners',authenticate, authorization, createBanner);
routerBanner.get('/banners', getAllBanners);
routerBanner.get('/banners/:id',getBannerById);
routerBanner.patch('/banners/:id', authenticate, authorization, updateBanner);
routerBanner.delete('/banners/:id', authenticate, authorization, deleteBanner);

export default routerBanner;