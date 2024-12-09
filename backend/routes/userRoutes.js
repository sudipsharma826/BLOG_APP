import express from 'express';
import { updateUser } from '../controller/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Update user route with file upload middleware
router.put('/update/:userId', verifyToken, upload.single('photoURL'), updateUser);

export default router;
