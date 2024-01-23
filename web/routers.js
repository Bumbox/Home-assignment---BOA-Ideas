import express from 'express';
import { handleDeleteCheckout, handleCartPost } from './controllers/controllers.js';

const router = express.Router();

router.post('/addCart', handleCartPost);

router.post('/deleteCart', handleDeleteCheckout);

export default router;
