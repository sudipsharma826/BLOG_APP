//Importing express
import express from 'express';
//Importing the controller
import { signin, signup } from '../controller/authController.js';
const router = express.Router();


// POST route to add user data
router.route('/signup').post(signup);
router.route('/signin').post(signin);

export default router;