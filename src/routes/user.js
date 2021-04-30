import express from "express";
import userCtrl from "../controller/user";
import authenticate from "../middlewares/authenticate";
const userRouter = express.Router();

userRouter.post("/login", userCtrl.login);
userRouter.post("/signup", userCtrl.register);
userRouter.put("/change_password", userCtrl.resetPassword);
userRouter.get("/users", authenticate , userCtrl.list);
userRouter.get("/user/:id" , userCtrl.find);

export default userRouter;
