import express from "express";
import { checkAuth, getUser, register, userLogin, userLogout } from "../controllers/user.controller.js";
import { validateUser } from "../middlewares/user.middleware.js";

const route = express();

route.route("/register").post(register);
route.route("/login").post(userLogin);
route.route("/logout").post(validateUser,userLogout);

route.route("/auth").get(validateUser,checkAuth);
route.route("/user/:id").get(validateUser,getUser);

export default route;