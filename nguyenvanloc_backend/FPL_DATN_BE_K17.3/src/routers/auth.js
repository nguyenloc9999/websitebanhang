import express from "express";
import { getAll, getOneById, logout, refreshToken, removebyAdmin, removebyUser, sendNewOtp, signin, signup, updateUser, updateUserByAdmin, verifyOTP } from "../controllers/auth.js";
import { authorization } from "../middlewares/authorization.js";
import { authenticate } from "../middlewares/authenticate.js";

const routerAuth = express.Router();

routerAuth.get("/users", getAll);
routerAuth.get("/users/:id", getOneById);
routerAuth.delete("/user/:id/admin", authenticate, authorization, removebyAdmin);
routerAuth.delete("/users/:id", authenticate, authorization, removebyUser);
routerAuth.patch("/user/:id/admin", authenticate, authorization, updateUserByAdmin);
routerAuth.patch("/users/:id", authenticate, updateUser);
routerAuth.post("/signup", signup);
routerAuth.post("/signin", signin);
routerAuth.post("/logout", authenticate, logout);
routerAuth.post("/refresh", refreshToken);
routerAuth.post("/verifyOTP", verifyOTP);
routerAuth.post("/sendnewOTP", sendNewOtp);


export default routerAuth;
