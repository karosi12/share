import express from "express";
import userCtrl from "../controller/user";
const userRouter = express.Router();

userRouter.post("/api/login", userCtrl.login);
userRouter.post("/api/signup", userCtrl.register);
userRouter.get("/api/users", userCtrl.list);

export default userRouter;
