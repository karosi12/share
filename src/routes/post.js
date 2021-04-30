import express from "express";
import authenticate from "../middlewares/authenticate";
import postCtrl from "../controller/post";
const postRouter = express.Router();

postRouter.post("/api/post", authenticate, postCtrl.create);
postRouter.get("/api/posts", postCtrl.list);
postRouter.get("/api/post/:id", postCtrl.view);
postRouter.patch("/api/post/like", authenticate, postCtrl.like);
postRouter.patch("/api/post/undolike", authenticate, postCtrl.undoLike);
postRouter.patch("/api/post/comment", authenticate, postCtrl.comment);
postRouter.patch("/api/post/subscribe", authenticate, postCtrl.subscribe);
postRouter.put("/api/post/:postId", authenticate, postCtrl.updatePost);
postRouter.delete("/api/post/:postId", authenticate, postCtrl.deletePost);

export default postRouter;
