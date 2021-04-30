import express from "express";
import authenticate from "../middlewares/authenticate";
import postCtrl from "../controller/post";
const postRouter = express.Router();

postRouter.post("/post", authenticate, postCtrl.create);
postRouter.get("/posts", postCtrl.list);
postRouter.get("/post/:id", postCtrl.view);
postRouter.patch("/post/like", authenticate, postCtrl.like);
postRouter.patch("/post/undolike", authenticate, postCtrl.undoLike);
postRouter.patch("/post/comment", authenticate, postCtrl.comment);
postRouter.patch("/post/subscribe", authenticate, postCtrl.subscribe);
postRouter.put("/post/:postId", authenticate, postCtrl.updatePost);
postRouter.delete("/post/:postId", authenticate, postCtrl.deletePost);

export default postRouter;
