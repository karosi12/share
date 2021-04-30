import express from "express";
import userCtrl from "../controller/user";
import authenticate from "../middlewares/authenticate";
const userRouter = express.Router();

userRouter.post("/api/login", userCtrl.login);
userRouter.post("/api/signup", userCtrl.register);
userRouter.get("/api/users", authenticate , userCtrl.list);

export default userRouter;
