//Importing express
import express from 'express';
//Importing the controller
import { signup } from '../controller/authController.js';
const router = express.Router();


// POST route to add user data
router.route('/signup').post(signup);

export default router;