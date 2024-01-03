import express from "express";
import { create, getAllComment, getCommentFromProduct, getOneComment, removeCommentByAdmin, removeCommentByUser, updateCommentByAdmin, updateCommentByUser } from "../controllers/comments.js";
import { authorization } from "../middlewares/authorization.js";
import { authenticate } from "../middlewares/authenticate.js";

const routerComment = express.Router();

routerComment.get("/comment/:productId", getCommentFromProduct);
routerComment.get("/comment/:id/detail", getOneComment);
routerComment.get("/comment", getAllComment);
routerComment.post("/comment", create);
routerComment.delete("/comment/:id/remove", removeCommentByUser);
routerComment.delete("/comments/:id/admin", authenticate, authorization, removeCommentByAdmin);
routerComment.patch("/comment/:id/update", updateCommentByUser);
routerComment.patch("/comments/:id/admin", authenticate, authorization, updateCommentByAdmin);



export default routerComment;