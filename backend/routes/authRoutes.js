//Importing express
import express from 'express';
//Importing the controller
import { googleouth, signin, signup } from '../controller/authController.js';
import { updateUser } from '../controller/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

// POST route to add user data
router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/googleouth').post(googleouth);
router.route('/update:userId').put(verifyToken, updateUser);

export default router;