import express from 'express';
import { checkSubscribed, deleteUser, getAdmin, getSavedPostIds, getSubscribedList, getUserByEmail, getUsers, handleSubscribe, handleSubscribeNonUser, removeSavedPost, sendEmail, signout, updateUser } from '../controller/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Update user route with file upload middleware
router.route('/update/:userId').put(verifyToken, upload.single('photoURL'), updateUser);
router.route('/delete/:userId').delete(verifyToken, deleteUser);
router.route('/signout/:userId').post(verifyToken, signout);
router.route('/getusers').get(verifyToken, getUsers);
router.route('/getuser/:email').get(getUserByEmail);
router.route("/getSubscribed").post(verifyToken,handleSubscribe);
router.route("/nonusersubscribe").post(handleSubscribeNonUser);
router.route("/checkSubscribed").post(verifyToken,checkSubscribed);
router.route("/getSavedPostIds/:userId").get(verifyToken, getSavedPostIds);
router.route("/unsavePost/:postId").post(verifyToken, removeSavedPost);
router.route("/getSubscribeList").get(verifyToken, getSubscribedList);
router.route("/sendEmail").post(verifyToken,upload.single('image') ,sendEmail);    
router.route("/getAdmin").get(getAdmin);


export default router;
