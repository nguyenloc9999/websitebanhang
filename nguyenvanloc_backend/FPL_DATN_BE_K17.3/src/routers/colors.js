import express from 'express';
import { createColor, getColor, getColorList, removeColor, updateColor } from '../controllers/colors.js';

const routerColor = express.Router();

routerColor.post('/colors', createColor);
routerColor.get('/colors', getColorList);
routerColor.patch("/colors/:id", updateColor);
routerColor.get("/colors/:id", getColor);
routerColor.delete("/colors/:id", removeColor);
export default routerColor;
