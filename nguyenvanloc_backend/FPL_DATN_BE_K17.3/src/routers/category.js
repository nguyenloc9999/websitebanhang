import express from "express";
import { addCategory, getAllCategory, getAllDelete, getCategoryById, removeCategory, removeForce, restoreCategory, updateCategory } from "../controllers/category.js";
import { authorization } from "../middlewares/authorization.js";
import { authenticate } from "../middlewares/authenticate.js";

const routerCategory = express.Router();

routerCategory.get("/category", getAllCategory)
routerCategory.get("/category/delete", getAllDelete)
routerCategory.get("/category/:id", getCategoryById)
routerCategory.delete("/category/:id", authenticate, authorization, removeCategory)
routerCategory.delete("/category/force/:id", authenticate, authorization, removeForce)
routerCategory.post("/category", authenticate, authorization, addCategory)
routerCategory.patch("/category/:id", authenticate, authorization, updateCategory)
routerCategory.patch("/category/restore/:id", authenticate, authorization, restoreCategory)


export default routerCategory;