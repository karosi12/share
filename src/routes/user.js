import express from "express";
const multer = require('multer');
import userCtrl from "../controller/user";
import authenticate from "../middlewares/authenticate";
const userRouter = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage });


userRouter.post("/login", userCtrl.login);
userRouter.post("/signup", userCtrl.register);
userRouter.put("/change_password", userCtrl.resetPassword);
userRouter.get("/users", authenticate , userCtrl.list);
userRouter.get("/user/:id" , userCtrl.find);
userRouter.post('/upload', upload.single('picture'), userCtrl.imageUpload);

export default userRouter;
