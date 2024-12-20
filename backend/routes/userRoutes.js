import express from 'express';
import { deleteUser, getUsers, signout, updateUser } from '../controller/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Update user route with file upload middleware
router.route('/update/:userId').put(verifyToken, upload.single('photoURL'), updateUser);
router.route('/delete/:userId').delete(verifyToken, deleteUser);
router.route('/signout/:userId').post(verifyToken, signout);
router.route('/getusers').get(verifyToken, getUsers);

export default router;
