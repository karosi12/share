import express from "express";
import authenticate from "../middlewares/authenticate";
import postCtrl from "../controller/post";
const postRouter = express.Router();

postRouter.post("/api/post", authenticate, postCtrl.create);
postRouter.get("/api/posts", postCtrl.list);
postRouter.get("/api/post/:id", postCtrl.view);
postRouter.get("/api/post/up-vote/:id", authenticate, postCtrl.upVote);
postRouter.get("/api/post/down-vote/:id", authenticate, postCtrl.downVote);
postRouter.patch("/api/post/comment", authenticate, postCtrl.comment);
postRouter.patch("/api/post/subscribe", authenticate, postCtrl.subscribe);

export default postRouter;
