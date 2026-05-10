import express from "express";
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { addCategory, createPost, deleteCategory, deletePost, getCategories,getCategoryBySlug,getFeaturedPosts,getPostBySlug, getPosts, likePost, lovePost, savePost, unlikePost, unlovePost, unSavePost, updateCategory, updatePost} from "../controller/postController.js";

//Routes
router.route("/createpost").post(verifyToken,upload.single('image'),createPost);
router.route("/getCategories").get(getCategories);
router.route("/getPost/:slug").get(optionalAuth, getPostBySlug);
router.route("/updatepost/:slug").put(verifyToken,upload.single('image'),updatePost);
router.route("/deletepost/:slug").delete(verifyToken,deletePost);
router.route("/getPosts").get(optionalAuth, getPosts);
router.route("/deleteCategory/:categoryId").delete(verifyToken,deleteCategory);
router.route("/likePost").put(verifyToken,likePost)
router.route("/unLikePost").put(verifyToken,unlikePost);
router.route("/lovePost").put(verifyToken,lovePost);
router.route("/unLovePost").put(verifyToken,unlovePost);
router.route("/savePost").put(verifyToken,savePost)
router.route("/unSavePost").put(verifyToken,unSavePost);
router.route("/getFeaturedPosts").get(optionalAuth, getFeaturedPosts);
router.route("/addCategory").post(verifyToken,upload.single('image'),addCategory);
router.route("/editCategoryImage/:categoryId").put(verifyToken,upload.single('image'),updateCategory);
router.route("/getCategory/:categorySlug").get(optionalAuth, getCategoryBySlug);



export default router;