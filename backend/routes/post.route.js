import express from "express";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, deletePost, getAllPosts, getCommentsofPost, getSavedPost, postReactions, savePost, sharePost } from "../controllers/post.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.route("/addpost").post(isAuth, upload.single('image'), addNewPost);
router.route("/getallposts").get(isAuth,getAllPosts);
router.route("/:id/reactions").post(isAuth, postReactions);
router.route("/:id/comment").post(isAuth, addComment); 
router.route("/:id/comment/all").get(isAuth, getCommentsofPost);
router.route("/delete/:id").delete(isAuth, deletePost);
router.route("/:id/save").get(isAuth, savePost);
router.route("/userpost").get(isAuth, getSavedPost);
router.route("/:id/share").post(isAuth, sharePost);

export default router;
