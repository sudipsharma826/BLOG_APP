import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createComment, deleteComment, getAllcomments, getPostComments, likeComment } from '../controller/commentController.js';

const router = express.Router();
router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.get("/getComments",verifyToken,getAllcomments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
export default router;