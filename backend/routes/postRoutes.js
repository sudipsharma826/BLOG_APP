import express from "express";
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { createPost, getCategories } from "../controller/postController.js";

//Routes
router.route("/createpost").post(verifyToken,upload.single('image'),createPost);
router.route("/getCategories").get(getCategories);

export default router;