import express from "express";
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { createPost, deletePost, getCategories ,getPostBySlug, getposts, updatePost} from "../controller/postController.js";

//Routes
router.route("/createpost").post(verifyToken,upload.single('image'),createPost);
router.route("/getCategories").get(getCategories);
router.route("/getPost/:slug").get(verifyToken,getPostBySlug);
router.route("/updatepost/:slug").put(verifyToken,upload.single('image'),updatePost);
router.route("/deletepost/:slug").delete(verifyToken,deletePost);
router.route("/getposts").get(getposts);

export default router;