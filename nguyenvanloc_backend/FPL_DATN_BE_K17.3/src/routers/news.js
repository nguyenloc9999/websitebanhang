import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";
import { addNew, getAllDelete, getAllNews, getNewById, removeForce, removeNew, restoreNew, updateNew } from "../controllers/news.js";

const routerNews = express.Router();

routerNews.get("/news", getAllNews)
routerNews.get("/news/delete", getAllDelete)
routerNews.get("/news/:id", getNewById)
routerNews.delete("/news/:id", authenticate, authorization, removeNew)
routerNews.delete("/news/force/:id", authenticate, authorization, removeForce)
routerNews.post("/news", authenticate, authorization, addNew)
routerNews.patch("/news/:id", authenticate, authorization, updateNew)
routerNews.patch("/news/restore/:id", authenticate, authorization, restoreNew)

export default routerNews;