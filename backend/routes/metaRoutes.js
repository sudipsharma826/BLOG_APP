import express from 'express';
import { getPostMeta } from '../controller/metaController.js';

const router = express.Router();

// Route to serve meta tags for social media crawlers
router.get('/post/:slug', getPostMeta);

export default router;
